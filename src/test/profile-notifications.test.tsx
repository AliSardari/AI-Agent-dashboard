import { afterEach, describe, expect, it } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import App from "../App";
import { router } from "../router";

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  document.documentElement.lang = "en";
  document.documentElement.dir = "ltr";
  router.navigate("/");
});

describe("notifications page", () => {
  it("lists alerts with an unread count, filters, and marks them read", async () => {
    render(<App />);
    router.navigate("/notifications");

    const heading = await screen.findByRole("heading", { name: /Notifications/ });
    expect(heading).toBeInTheDocument();

    // Several items are unread by default.
    await waitFor(() => {
      expect(screen.getByText(/unread/)).toBeInTheDocument();
    });

    // Filter to unread only.
    fireEvent.click(screen.getByRole("button", { name: "Unread" }));
    await waitFor(() => {
      // The "mark all as read" control stays enabled while unread remain.
      expect(
        screen.getByRole("button", { name: "Mark all as read" }),
      ).toBeEnabled();
    });

    // Mark everything read — the list empties and the control disables.
    fireEvent.click(screen.getByRole("button", { name: "Mark all as read" }));
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Mark all as read" }),
      ).toBeDisabled();
    });
    expect(screen.getByText(/all caught up/i)).toBeInTheDocument();
  });
});

describe("profile page", () => {
  it("shows a guest prompt when signed out", async () => {
    render(<App />);
    router.navigate("/profile");

    expect(
      await screen.findByText(/browsing as a guest/i),
    ).toBeInTheDocument();
    // The sidebar auth card also offers sign-in, so expect several matches.
    expect(
      screen.getAllByRole("link", { name: /Sign in/ }).length,
    ).toBeGreaterThan(0);
  });

  it("shows the signed-in profile and opens settings", async () => {
    window.localStorage.setItem(
      "aud.session",
      JSON.stringify({
        name: "Ali Reza",
        email: "ali@example.com",
        createdAt: Date.now(),
      }),
    );
    render(<App />);
    router.navigate("/profile");

    // Wait for the profile page itself (the sidebar also shows the name).
    const settings = await screen.findByRole("link", {
      name: /Open account settings/,
    });
    expect(settings).toBeInTheDocument();
    expect(screen.getAllByText("Ali Reza").length).toBeGreaterThan(0);
    expect(screen.getAllByText("ali@example.com").length).toBeGreaterThan(0);

    fireEvent.click(settings);
    expect(
      await screen.findAllByRole("heading", { name: "Settings" }),
    ).not.toHaveLength(0);
  });
});
