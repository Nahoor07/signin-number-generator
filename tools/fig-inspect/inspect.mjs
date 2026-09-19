#!/usr/bin/env node
/**
 * Reads a Figma .fig file (from the exported zip) and prints the resolved
 * layer tree of one frame: sizes, positions, auto layout, fills, strokes,
 * radii, effects, fonts and texts, with design variables resolved to values.
 *
 * Usage:
 *   node inspect.mjs <canvas.fig> --list                 list pages and frames
 *   node inspect.mjs <canvas.fig> <nodeId> [--mobile]    dump one frame
 *   node inspect.mjs <canvas.fig> --icon "<symbol name>" SVG path of an icon
 *
 * --mobile resolves typography variables in their "Mobile" mode, which the
 * [MOBILE] frames use.
 *
 * Format: a .fig file is "fig-kiwi" + version + length-prefixed chunks.
 * Chunk 0 is the compressed Kiwi schema, chunk 1 the compressed document
 * (deflate or zstd). Instances only reference their main component, so the
 * tool expands them and applies the instance overrides itself.
 */
import fs from "node:fs";

import { decompress as zstd } from "fzstd";
import { compileSchema, decodeBinarySchema } from "kiwi-schema";
import * as pako from "pako";

const [file, ...args] = process.argv.slice(2);
if (!file) {
  console.error("Usage: node inspect.mjs <canvas.fig> (--list | <nodeId> [--mobile] | --icon <name>)");
  process.exit(1);
}

// ---------------------------------------------------------------- decoding

function decodeFig(path) {
  const buffer = fs.readFileSync(path);
  const chunks = [];
  for (let offset = 12; offset < buffer.length; ) {
    const length = buffer.readUInt32LE(offset);
    chunks.push(buffer.subarray(offset + 4, offset + 4 + length));
    offset += 4 + length;
  }
  const inflate = (chunk) => {
    if (chunk[0] === 0x28 && chunk[1] === 0xb5) return zstd(chunk);
    try {
      return pako.inflateRaw(chunk);
    } catch {
      return pako.inflate(chunk);
    }
  };
  const schema = compileSchema(decodeBinarySchema(inflate(chunks[0])));
  return schema.decodeMessage(inflate(chunks[1]));
}

const message = decodeFig(file);
const guid = (g) => (g ? `${g.sessionID}:${g.localID}` : "");

const nodes = new Map();
for (const change of message.nodeChanges) nodes.set(guid(change.guid), { ...change, children: [] });
for (const node of nodes.values()) nodes.get(guid(node.parentIndex?.guid))?.children.push(node);
for (const node of nodes.values()) {
  node.children.sort((a, b) => (a.parentIndex.position < b.parentIndex.position ? -1 : 1));
}

// ---------------------------------------------------------------- variables

const mobile = args.includes("--mobile");
// Theme "Light", Primary color "Default", Typography "Desktop" or "Mobile"
const MODES = mobile ? ["2758:4", "4078:5", "296:1", "4061:2"] : ["2758:4", "4078:5", "296:0", "4061:1"];

function resolveVariable(ref, depth = 0) {
  const variable = nodes.get(guid(ref));
  if (!variable || depth > 10) return undefined;
  const entries = variable.variableDataValues?.entries ?? [];
  const entry = entries.find((e) => MODES.includes(guid(e.modeID))) ?? entries[0];
  const value = entry?.variableData.value;
  if (value?.alias) return resolveVariable(value.alias.guid, depth + 1);
  return value?.colorValue ?? value?.floatValue ?? value?.textValue ?? value;
}

const hex = (c) =>
  "#" +
  [c.r, c.g, c.b].map((v) => Math.round(v * 255).toString(16).padStart(2, "0")).join("") +
  (c.a < 1 ? ` @${+c.a.toFixed(3)}` : "");

function paint(p) {
  if (p.visible === false) return null;
  const alias = p.colorVar?.value?.alias?.guid;
  // Cached colours inside instances can be stale; the variable is what Figma renders.
  const color = alias ? resolveVariable(alias) : p.color;
  let out =
    p.type === "SOLID"
      ? hex(color ?? p.color)
      : p.type === "IMAGE"
        ? `image(${Buffer.from(p.image.hash).toString("hex")}, ${p.imageScaleMode})`
        : p.type;
  if (p.opacity !== undefined && p.opacity !== 1) out += ` opacity ${+p.opacity.toFixed(3)}`;
  if (alias) out += ` {${nodes.get(guid(alias))?.name}}`;
  return out;
}

// ---------------------------------------------------------------- instances

const clone = (node) => ({ ...node, children: node.children.map(clone) });
const keyOf = (node) => guid(node.overrideKey ?? node.guid);

function findByKey(node, key) {
  for (const child of node.children) {
    if (keyOf(child) === key || guid(child.guid) === key) return child;
    if (child.type !== "INSTANCE") {
      const found = findByKey(child, key);
      if (found) return found;
    }
  }
  return null;
}

function expand(node, props) {
  for (const ref of node.componentPropRefs ?? []) {
    const value = props?.[guid(ref.defID)];
    if (!value) continue;
    if (ref.componentPropNodeField === "TEXT_DATA" && value.textValue) node.textData = value.textValue;
    if (ref.componentPropNodeField === "VISIBLE" && value.boolValue !== undefined) node.visible = value.boolValue;
    if (ref.componentPropNodeField === "OVERRIDDEN_SYMBOL_ID" && value.guidValue) {
      node.symbolData = { ...node.symbolData, symbolID: value.guidValue };
    }
  }

  if (node.type !== "INSTANCE") {
    for (const child of node.children) expand(child, props);
    return;
  }

  // Overrides handed down from an outer instance (see route() below)
  if (node.pending) {
    node.symbolData = {
      ...node.symbolData,
      symbolOverrides: [...(node.symbolData.symbolOverrides ?? []), ...node.pending.overrides],
    };
    node.derivedSymbolData = [...(node.derivedSymbolData ?? []), ...node.pending.derived];
  }

  const main = nodes.get(guid(node.symbolData.symbolID));
  if (!main) return;
  node.children = main.children.map(clone);
  node.componentName = main.name;

  const ownProps = {};
  for (const def of main.componentPropDefs ?? []) ownProps[guid(def.id)] = def.initialValue;
  for (const assignment of node.componentPropAssignments ?? []) ownProps[guid(assignment.defID)] = assignment.value;

  // Overrides with a one-step path apply here; longer paths are handed down
  // to the nested instance they start with.
  const route = (list, apply) => {
    for (const entry of list ?? []) {
      const [first, ...rest] = entry.guidPath.guids.map(guid);
      const target = node.children.length ? findByKey(node, first) : null;
      if (!target && first !== guid(main.guid)) continue;
      const { guidPath, ...fields } = entry;
      if (rest.length === 0) apply(target ?? node, fields);
      else if (target) {
        target.pending ??= { overrides: [], derived: [] };
        target.pending[apply === applyOverride ? "overrides" : "derived"].push({
          ...entry,
          guidPath: { guids: guidPath.guids.slice(1) },
        });
      }
    }
  };
  route(node.symbolData.symbolOverrides, applyOverride);
  route(node.derivedSymbolData, applyDerived);

  for (const child of node.children) expand(child, ownProps);
}

function applyOverride(target, fields) {
  Object.assign(target, fields);
  if (target.type === "INSTANCE" && fields.overriddenSymbolID) {
    target.symbolData = { ...target.symbolData, symbolID: fields.overriddenSymbolID };
  }
}

function applyDerived(target, fields) {
  // Auto layout results (final size and position) after overrides
  if (fields.size) target.size = fields.size;
  if (fields.transform) target.transform = fields.transform;
}

// ---------------------------------------------------------------- printing

function describe(node) {
  const parts = [`${node.type}${node.componentName ? `<${node.componentName}>` : ""} "${node.name}"`];
  if (node.size) parts.push(`${+node.size.x.toFixed(2)}×${+node.size.y.toFixed(2)}`);
  if (node.transform) parts.push(`at ${+node.transform.m02.toFixed(2)},${+node.transform.m12.toFixed(2)}`);
  if (node.visible === false) parts.push("HIDDEN");
  if (node.opacity !== undefined && node.opacity < 1) parts.push(`opacity ${+node.opacity.toFixed(3)}`);

  const fills = (node.fillPaints ?? []).map(paint).filter(Boolean);
  if (fills.length) parts.push(`fill [${fills.join(" | ")}]`);
  const strokes = (node.strokePaints ?? []).map(paint).filter(Boolean);
  if (strokes.length) parts.push(`stroke [${strokes.join(" | ")}] ${node.strokeWeight}px`);

  const radius = node.rectangleCornerRadiiIndependent
    ? [node.rectangleTopLeftCornerRadius, node.rectangleTopRightCornerRadius, node.rectangleBottomRightCornerRadius, node.rectangleBottomLeftCornerRadius].join("/")
    : node.cornerRadius;
  if (radius) parts.push(`radius ${radius}`);

  for (const effect of node.effects ?? []) {
    if (effect.visible === false) continue;
    parts.push(
      effect.type === "DROP_SHADOW"
        ? `shadow ${effect.offset.x} ${effect.offset.y} ${effect.radius} ${effect.spread ?? 0} ${hex(effect.color)}`
        : `${effect.type.toLowerCase()} ${effect.radius}`,
    );
  }

  if (node.stackMode && node.stackMode !== "NONE") {
    const t = node.stackVerticalPadding ?? 0;
    const l = node.stackHorizontalPadding ?? 0;
    const r = node.stackPaddingRight ?? l;
    const b = node.stackPaddingBottom ?? t;
    parts.push(
      `auto-layout ${node.stackMode.toLowerCase()} gap ${node.stackSpacing ?? 0} padding ${t}/${r}/${b}/${l}` +
        ` align ${node.stackPrimaryAlignItems ?? "MIN"}/${node.stackCounterAlignItems ?? "MIN"}`,
    );
  }
  if (node.stackPositioning === "ABSOLUTE") parts.push("absolute");
  if (node.stackChildPrimaryGrow) parts.push("grow");

  if (node.type === "TEXT") {
    // Typography variables are bound either on the layer or on its text style
    const textStyle = nodes.get(guid(node.styleIdForText?.guid));
    const variables = Object.fromEntries(
      [...(textStyle?.variableConsumptionMap?.entries ?? []), ...(node.variableConsumptionMap?.entries ?? [])]
        .filter((e) => e.variableData?.value?.alias)
        .map((e) => [e.variableField, resolveVariable(e.variableData.value.alias.guid)]),
    );
    const size = variables.FONT_SIZE ?? node.fontSize;
    const lineHeight = variables.LINE_HEIGHT ?? `${node.lineHeight?.value}${node.lineHeight?.units === "PERCENT" ? "%" : "px"}`;
    parts.push(
      `font ${node.fontName?.family} ${node.fontName?.style} ${size}/${lineHeight}` +
        `${textStyle ? ` (style ${textStyle.name})` : ""} align ${node.textAlignHorizontal ?? "LEFT"}`,
    );
    parts.push(`text ${JSON.stringify(node.textData?.characters)}`);
  }
  return parts.join("  ");
}

function print(node, depth = 0) {
  console.log("  ".repeat(depth) + describe(node));
  if (node.visible === false) return;
  for (const child of node.children) print(child, depth + 1);
}

function iconPath(name) {
  const main = [...nodes.values()].find((n) => n.type === "SYMBOL" && n.name === name);
  const vector = main?.children.find((c) => c.name === "primary-shape");
  if (!vector) throw new Error(`No icon named ${name}`);
  const commands = { 0: ["Z", 0], 1: ["M", 2], 2: ["L", 2], 3: ["Q", 4], 4: ["C", 6] };
  for (const geometry of vector.fillGeometry) {
    const bytes = Buffer.from(message.blobs[geometry.commandsBlob].bytes);
    let d = "";
    for (let i = 0; i < bytes.length; ) {
      const [letter, count] = commands[bytes[i++]];
      const values = Array.from({ length: count }, (_, k) => +bytes.readFloatLE(i + k * 4).toFixed(3));
      i += count * 4;
      d += letter + values.join(" ");
    }
    console.log(`translate(${vector.transform.m02} ${vector.transform.m12})  ${geometry.windingRule}\n${d}\n`);
  }
}

// ---------------------------------------------------------------- main

if (args[0] === "--list") {
  const document = [...nodes.values()].find((n) => n.type === "DOCUMENT");
  for (const page of document.children) {
    console.log(`${page.name}`);
    for (const frame of page.children) {
      if (frame.type === "FRAME") console.log(`  ${guid(frame.guid)}  ${frame.name}  ${frame.size.x}×${frame.size.y}`);
    }
  }
} else if (args[0] === "--icon") {
  iconPath(args[1]);
} else {
  const root = nodes.get(args[0]);
  if (!root) throw new Error(`Node ${args[0]} not found, use --list`);
  const tree = clone(root);
  expand(tree, {});
  print(tree);
}
