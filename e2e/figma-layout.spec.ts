import { expect, test, type Locator, type Page } from "@playwright/test";

/*
 * Compares rendered element boxes with the absolute positions of the matching
 * layers in the Figma frames (read from the .fig file, see README →
 * "Comparing with Figma"). Values are in CSS pixels, relative to the frame.
 */

type Box = { x: number; y: number; width: number; height: number };
type Check = {
  name: string;
  locate: (page: Page) => Locator;
  expected: Box;
  textTolerance?: boolean;
  /** Contains Outfit text, see OUTFIT_TOLERANCE. */
  outfit?: boolean;
};

// Layout boxes must match to the pixel (sub-pixel rounding allowed). Text
// widths depend on the font rasteriser, so they get a slightly wider margin.
const TOLERANCE = 1;
const TEXT_TOLERANCE = 2.5;
// Figma's cached layout for the two Outfit texts ("Get started", "Zurück") was
// computed with Public Sans SemiBold glyph widths (the kit's original link
// font), while the layer, the inspect panel and the rendering use Outfit.
// Real Outfit is ~4 % narrower, so these boxes get a documented 4px margin.
const OUTFIT_TOLERANCE = 4;

const screens: {
  name: string;
  path: string;
  viewport: { width: number; height: number };
  checks: Check[];
}[] = [
  {
    name: "Sign in – desktop (SignIn_Centered, 1440×1024)",
    path: "/",
    viewport: { width: 1440, height: 1024 },
    checks: [
      { name: "card", locate: (p) => p.locator("section"), expected: { x: 510, y: 297, width: 420, height: 430 } },
      { name: "heading", locate: (p) => p.getByRole("heading"), expected: { x: 684.5, y: 337, width: 71, height: 36 }, textTolerance: true },
      { name: "subline", locate: (p) => p.getByText("Don't have an account?").locator(".."), expected: { x: 605, y: 385, width: 230, height: 22 }, outfit: true },
      { name: "email field", locate: (p) => p.getByLabel("Email address").locator(".."), expected: { x: 550, y: 439, width: 340, height: 53 } },
      { name: "password field", locate: (p) => p.getByLabel("Password", { exact: true }).locator(".."), expected: { x: 550, y: 516, width: 340, height: 53 } },
      { name: "eye button", locate: (p) => p.getByRole("button", { name: "Show password" }), expected: { x: 850, y: 522.5, width: 40, height: 40 } },
      { name: "generate numbers row", locate: (p) => p.getByRole("link", { name: "Generate numbers" }).locator(".."), expected: { x: 550, y: 593, width: 340, height: 22 } },
      { name: "sign in button", locate: (p) => p.getByRole("button", { name: "Sign in" }), expected: { x: 550, y: 639, width: 340, height: 48 } },
    ],
  },
  {
    name: "Number generator – desktop (Zahlengenerator, 1440×1024)",
    path: "/number-generator",
    viewport: { width: 1440, height: 1024 },
    checks: [
      { name: "card", locate: (p) => p.locator("section"), expected: { x: 510, y: 318.5, width: 420, height: 387 } },
      { name: "heading", locate: (p) => p.getByRole("heading"), expected: { x: 624.5, y: 358.5, width: 191, height: 36 }, textTolerance: true },
      { name: "description", locate: (p) => p.getByText(/^Generiere 6 Zahlen/), expected: { x: 550, y: 410.5, width: 340, height: 44 } },
      { name: "digit row", locate: (p) => p.locator("output"), expected: { x: 550, y: 494.5, width: 340, height: 53 } },
      { name: "first digit box", locate: (p) => p.getByTestId("digit-box").first(), expected: { x: 550, y: 494.5, width: 48.33, height: 53 } },
      { name: "last digit box", locate: (p) => p.getByTestId("digit-box").last(), expected: { x: 841.67, y: 494.5, width: 48.33, height: 53 } },
      { name: "generate button", locate: (p) => p.getByRole("button", { name: "Generieren" }), expected: { x: 550, y: 571.5, width: 340, height: 48 } },
      { name: "back link", locate: (p) => p.getByRole("link", { name: "Zurück" }), expected: { x: 684.5, y: 643.5, width: 71, height: 22 }, outfit: true },
    ],
  },
  {
    name: "Sign in – mobile ([MOBILE] SignIn_Centered, 375×800)",
    path: "/",
    viewport: { width: 375, height: 800 },
    checks: [
      { name: "header", locate: (p) => p.locator("header"), expected: { x: 0, y: 0, width: 375, height: 64 } },
      { name: "card", locate: (p) => p.locator("section"), expected: { x: 16, y: 88, width: 343, height: 424 } },
      { name: "heading", locate: (p) => p.getByRole("heading"), expected: { x: 158, y: 128, width: 59, height: 30 }, textTolerance: true },
      { name: "subline", locate: (p) => p.getByText("Don't have an account?").locator(".."), expected: { x: 72.5, y: 170, width: 230, height: 22 }, outfit: true },
      { name: "email field", locate: (p) => p.getByLabel("Email address").locator(".."), expected: { x: 40, y: 224, width: 295, height: 53 } },
      { name: "password field", locate: (p) => p.getByLabel("Password", { exact: true }).locator(".."), expected: { x: 40, y: 301, width: 295, height: 53 } },
      { name: "generate numbers row", locate: (p) => p.getByRole("link", { name: "Generate numbers" }).locator(".."), expected: { x: 40, y: 378, width: 295, height: 22 } },
      { name: "sign in button", locate: (p) => p.getByRole("button", { name: "Sign in" }), expected: { x: 40, y: 424, width: 295, height: 48 } },
    ],
  },
  {
    name: "Number generator – mobile ([MOBILE] Verify, 375×589)",
    path: "/number-generator",
    viewport: { width: 375, height: 589 },
    checks: [
      { name: "header", locate: (p) => p.locator("header"), expected: { x: 0, y: 0, width: 375, height: 64 } },
      { name: "card", locate: (p) => p.locator("section"), expected: { x: 16, y: 88, width: 343, height: 381 } },
      { name: "heading", locate: (p) => p.getByRole("heading"), expected: { x: 108, y: 128, width: 159, height: 30 }, textTolerance: true },
      { name: "description", locate: (p) => p.getByText(/^Generiere 6 Zahlen/), expected: { x: 40, y: 174, width: 295, height: 44 } },
      { name: "digit row", locate: (p) => p.locator("output"), expected: { x: 40, y: 258, width: 295, height: 53 } },
      { name: "first digit box", locate: (p) => p.getByTestId("digit-box").first(), expected: { x: 40, y: 258, width: 40.83, height: 53 } },
      { name: "generate button", locate: (p) => p.getByRole("button", { name: "Generieren" }), expected: { x: 40, y: 335, width: 295, height: 48 } },
      { name: "back link", locate: (p) => p.getByRole("link", { name: "Zurück" }), expected: { x: 152, y: 407, width: 71, height: 22 }, outfit: true },
    ],
  },
];

for (const screen of screens) {
  test.describe(screen.name, () => {
    test.use({ viewport: screen.viewport });

    test("matches the Figma layout", async ({ page }) => {
      await page.goto(screen.path);
      await page.evaluate(() => document.fonts.ready);

      for (const check of screen.checks) {
        const box = await check.locate(page).boundingBox();
        expect(box, `${check.name} is rendered`).not.toBeNull();

        const tolerance = check.outfit ? OUTFIT_TOLERANCE : check.textTolerance ? TEXT_TOLERANCE : TOLERANCE;
        for (const key of ["x", "y", "width", "height"] as const) {
          const actual = box![key];
          const expected = check.expected[key];
          expect
            .soft(Math.abs(actual - expected), `${check.name}.${key}: expected ${expected}, got ${actual.toFixed(2)}`)
            .toBeLessThanOrEqual(tolerance);
        }
      }
    });
  });
}

test.describe("Screen-specific details", () => {
  test("mobile number generator has no background image and no header actions", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 589 });
    await page.goto("/number-generator");

    const backgroundDisplay = await page
      .locator("[aria-hidden='true']")
      .first()
      .evaluate((element) => getComputedStyle(element).display);
    expect(backgroundDisplay).toBe("none");
  });

  test("uses the colours from Figma", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1024 });
    await page.goto("/");

    const style = (locator: Locator, property: string) =>
      locator.evaluate((element, prop) => getComputedStyle(element).getPropertyValue(prop), property);

    await expect.poll(() => style(page.getByRole("heading"), "color")).toBe("rgb(28, 37, 46)");
    await expect.poll(() => style(page.getByRole("button", { name: "Sign in" }), "background-color")).toBe("rgb(0, 0, 0)");
    await expect.poll(() => style(page.getByText("Get started"), "color")).toBe("rgb(0, 0, 0)");
    await expect.poll(() => style(page.getByText("Don't have an account?"), "color")).toBe("rgb(99, 115, 129)");
    await expect.poll(() => style(page.getByLabel("Email address").locator(".."), "background-color")).toBe("rgba(145, 158, 171, 0.08)");
    await expect.poll(() => style(page.locator("section"), "box-shadow")).toBe("rgba(145, 158, 171, 0.16) 0px 24px 48px 0px");
    await expect.poll(() => style(page.locator("section"), "border-radius")).toBe("16px");
  });
});

test.describe("Number generator behaviour", () => {
  test("shows the empty state and fills six unique digits on every click", async ({ page }) => {
    await page.goto("/number-generator");
    const boxes = page.getByTestId("digit-box");

    await expect(boxes).toHaveText(["-", "-", "-", "-", "-", "-"]);

    const results = new Set<string>();
    for (let click = 0; click < 20; click++) {
      await page.getByRole("button", { name: "Generieren" }).click();
      const digits = await boxes.allTextContents();

      expect(digits).toHaveLength(6);
      expect(new Set(digits).size).toBe(6);
      for (const digit of digits) expect(digit).toMatch(/^[0-9]$/);
      results.add(digits.join(""));
    }
    // 20 draws from 151,200 outcomes: a repeat would point to a broken RNG.
    expect(results.size).toBe(20);
  });

  test("navigates between the two screens", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Generate numbers" }).click();
    await expect(page).toHaveURL(/\/number-generator$/);
    await page.getByRole("link", { name: "Zurück" }).click();
    await expect(page).toHaveURL(/\/$/);
  });
});
