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

async function goTo(path: "/login" | "/register") {
  render(<App />);
  router.navigate(path);
  await screen.findByRole("heading", {
    name: path === "/login" ? "Welcome back" : "Create your account",
  });
}

describe("login page", () => {
  it("validates fields before submitting", async () => {
    await goTo("/login");

    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));
    // Both fields report the same error.
    expect(
      (await screen.findAllByText("This field is required")).length,
    ).toBe(2);

    const email = screen.getByLabelText("Email");
    fireEvent.change(email, { target: { value: "not-an-email" } });
    fireEvent.blur(email);
    expect(
      await screen.findByText("Enter a valid email address"),
    ).toBeInTheDocument();
  });

  it("signs in, persists the session and returns to the dashboard", async () => {
    await goTo("/login");

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "ali.reza@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "secret123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    // Submitting state is visible, then the dashboard renders.
    await waitFor(() => {
      expect(window.localStorage.getItem("aud.session")).toBeTruthy();
    });
    expect(
      await screen.findAllByRole("heading", { name: "Overview" }),
    ).not.toHaveLength(0);

    const session = JSON.parse(
      window.localStorage.getItem("aud.session") ?? "{}",
    );
    expect(session.email).toBe("ali.reza@example.com");
    expect(session.name).toBe("Ali Reza");
  });
});

describe("register page", () => {
  it("rejects mismatched password confirmation", async () => {
    await goTo("/register");

    fireEvent.change(screen.getByLabelText("Full name"), {
      target: { value: "Ali Reza" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "ali@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "secret123" },
    });
    fireEvent.change(screen.getByLabelText("Confirm password"), {
      target: { value: "different123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Create account" }));

    expect(
      await screen.findByText("Passwords do not match"),
    ).toBeInTheDocument();
  });

  it("creates the account on valid input", async () => {
    await goTo("/register");

    fireEvent.change(screen.getByLabelText("Full name"), {
      target: { value: "Ali Reza" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "ali@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "secret123" },
    });
    fireEvent.change(screen.getByLabelText("Confirm password"), {
      target: { value: "secret123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Create account" }));

    expect(
      await screen.findAllByRole("heading", { name: "Overview" }),
    ).not.toHaveLength(0);
    const session = JSON.parse(
      window.localStorage.getItem("aud.session") ?? "null",
    );
    expect(session.name).toBe("Ali Reza");
  });
});

describe("signed-in state", () => {
  it("shows the user in the sidebar and signs out", async () => {
    window.localStorage.setItem(
      "aud.session",
      JSON.stringify({ name: "Ali Reza", email: "ali@example.com" }),
    );
    render(<App />);

    expect(
      await screen.findByText(/Signed in as · ali@example.com/),
    ).toBeInTheDocument();
    // Initials appear in both the header avatar and the sidebar card.
    expect(screen.getAllByText("AR").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: "Sign out" }));

    await waitFor(() => {
      expect(window.localStorage.getItem("aud.session")).toBeNull();
    });
    expect(await screen.findByText("Access your workspace")).toBeInTheDocument();
  });
});
