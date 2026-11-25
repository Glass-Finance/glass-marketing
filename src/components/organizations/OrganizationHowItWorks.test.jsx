import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import OrganizationHowItWorks from "./OrganizationHowItWorks";

// jsdom has no IntersectionObserver, which is the component's no-IO branch:
// every card reveals immediately. That is also the assertion surface here —
// what the section renders, not how it animates.
const renderSection = () =>
  render(
    <MemoryRouter>
      <OrganizationHowItWorks />
    </MemoryRouter>,
  );

describe("OrganizationHowItWorks", () => {
  it("keeps the id the footer's /#how-it-works link scrolls to", () => {
    renderSection();
    expect(document.getElementById("how-it-works")).not.toBeNull();
  });

  it("renders the reference header copy", () => {
    renderSection();
    expect(screen.getByRole("heading", { level: 2, name: "How it works" })).toBeTruthy();
    expect(
      screen.getByText(
        "From an empty workspace to a live community that collects payments, in four steps.",
      ),
    ).toBeTruthy();
  });

  it("renders all four steps, in order, with their titles", () => {
    renderSection();
    const steps = screen.getAllByLabelText(/^Step \d$/);
    expect(steps).toHaveLength(4);
    expect(steps.map((step) => step.getAttribute("aria-label"))).toEqual([
      "Step 1",
      "Step 2",
      "Step 3",
      "Step 4",
    ]);

    // Each title line is its own block element, so textContent has no
    // separator between them — assert the exact concatenation.
    const titles = [
      "Create your Community andget started!",
      "Add Your Members",
      "Create Your Payment Plan",
      "Launch YourCommunity",
    ];
    steps.forEach((step, i) => {
      expect(within(step).getByRole("heading").textContent).toBe(titles[i]);
    });
  });

  it("loads the four screenshots and four icons from /hiw", () => {
    renderSection();
    const steps = screen.getAllByLabelText(/^Step \d$/);
    steps.forEach((step, i) => {
      // The icon is aria-hidden, so it is out of the accessibility tree and
      // getAllByRole("img") would (correctly) skip it — query the DOM for
      // both instead.
      const icon = step.querySelector(".hiw-ico img");
      const screenshot = step.querySelector(".hiw-screen img");
      expect(icon?.getAttribute("src")).toBe(`/hiw/icon-${i + 1}.svg`);
      expect(icon?.getAttribute("alt")).toBe("");
      expect(screenshot?.getAttribute("src")).toBe(`/hiw/step-${i + 1}.webp`);
      expect((screenshot?.getAttribute("alt") ?? "").length).toBeGreaterThan(0);
    });
  });

  it("keeps the Join Glass CTA", () => {
    renderSection();
    expect(screen.getByRole("button", { name: /Join Glass/ })).toBeTruthy();
  });
});
