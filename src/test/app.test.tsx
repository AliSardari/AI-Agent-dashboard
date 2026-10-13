import { afterEach, describe, expect, it } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import App from "../App";

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  document.documentElement.lang = "en";
  document.documentElement.dir = "ltr";
});

describe("app shell", () => {
  it("renders the sidebar navigation and the overview page", async () => {
    render(<App />);

    const sidebar = within(screen.getByRole("navigation"));
    const links = sidebar.getAllByRole("link");
    expect(links.map((link) => link.getAttribute("href"))).toEqual([
      "/",
      "/models",
      "/requests",
      "/settings",
    ]);

    expect(
      (await screen.findAllByRole("heading", { name: "Overview" })).length,
    ).toBeGreaterThan(0);
    expect(document.documentElement.lang).toBe("en");
    expect(document.documentElement.dir).toBe("ltr");
  });

  it("switches to Persian and flips the document to RTL", async () => {
    render(<App />);

    fireEvent.click(await screen.findByRole("button", { name: "فا" }));

    await waitFor(() => {
      expect(document.documentElement.dir).toBe("rtl");
      expect(document.documentElement.lang).toBe("fa");
    });

    expect(
      (await screen.findAllByRole("heading", { name: "نمای کلی" })).length,
    ).toBeGreaterThan(0);
    expect(window.localStorage.getItem("aud.lang")).toBe("fa");
  });

  it("persists the theme class on the document element", async () => {
    render(<App />);

    const toggle = await screen.findByRole("button", { name: /Toggle theme/ });
    fireEvent.click(toggle);

    await waitFor(() => {
      expect(window.localStorage.getItem("aud.theme")).toBeTruthy();
      const stored = window.localStorage.getItem("aud.theme");
      expect(document.documentElement.classList.contains("dark")).toBe(
        stored === "dark",
      );
    });
  });
});
