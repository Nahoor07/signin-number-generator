import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import * as generator from "@/lib/generate-unique-digits";

import { NumberGenerator } from "./NumberGenerator";

vi.mock("next/link", () => ({
  default: ({ href, ...props }: { href: string } & React.ComponentProps<"a">) => (
    <a href={href} {...props} />
  ),
}));

const boxTexts = () => screen.getAllByTestId("digit-box").map((box) => box.textContent);

describe("NumberGenerator", () => {
  it("shows six empty boxes before the first click", () => {
    render(<NumberGenerator />);

    expect(boxTexts()).toEqual(["-", "-", "-", "-", "-", "-"]);
    for (const box of screen.getAllByTestId("digit-box")) {
      expect(box).toHaveAttribute("data-empty", "true");
    }
  });

  it("renders the result of generateUniqueDigits on click", async () => {
    const spy = vi
      .spyOn(generator, "generateUniqueDigits")
      .mockReturnValueOnce([4, 0, 9, 1, 7, 3])
      .mockReturnValueOnce([2, 8, 5, 6, 0, 1]);
    render(<NumberGenerator />);
    const button = screen.getByRole("button", { name: "Generieren" });

    await userEvent.click(button);
    expect(boxTexts()).toEqual(["4", "0", "9", "1", "7", "3"]);
    expect(screen.getByRole("status")).toHaveTextContent("Generierte Zahlen: 4, 0, 9, 1, 7, 3");

    await userEvent.click(button);
    expect(boxTexts()).toEqual(["2", "8", "5", "6", "0", "1"]);
    expect(spy).toHaveBeenCalledTimes(2);

    spy.mockRestore();
  });

  it("shows six unique digits with the real generator", async () => {
    render(<NumberGenerator />);

    await userEvent.click(screen.getByRole("button", { name: "Generieren" }));

    const digits = boxTexts();
    expect(new Set(digits).size).toBe(6);
    digits.forEach((digit) => expect(digit).toMatch(/^[0-9]$/));
  });
});
