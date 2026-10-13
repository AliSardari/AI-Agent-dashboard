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
import { router } from "../router";

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  document.documentElement.lang = "en";
  document.documentElement.dir = "ltr";
  window.history.pushState({}, "", "/");
});

async function goToRequests() {
  render(<App />);
  const sidebar = within(screen.getByRole("navigation"));
  fireEvent.click(sidebar.getByRole("link", { name: /Requests/ }));
  // Header row + 12 rows for the first page.
  await waitFor(() => {
    expect(screen.getAllByRole("row")).toHaveLength(13);
  });
  return screen.getByRole("table");
}

describe("requests page", () => {
  it("paginates the log and moves between pages", async () => {
    await goToRequests();

    expect(screen.getByText("Showing 1–12 of 256")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(
      await screen.findByText("Showing 13–24 of 256"),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Previous" }));
    expect(await screen.findByText("Showing 1–12 of 256")).toBeInTheDocument();
  });

  it("filters rows by status", async () => {
    await goToRequests();
    const table = screen.getByRole("table");

    fireEvent.click(screen.getByRole("button", { name: "Error" }));

    await waitFor(() => {
      const badges = within(table).getAllByText("Error");
      expect(badges.length).toBeGreaterThan(0);
    });
    expect(within(table).queryByText("Success")).toBeNull();
    expect(within(table).queryByText("Rate limited")).toBeNull();
  });

  it("shows the empty state when the search matches nothing", async () => {
    await goToRequests();

    const input = screen.getByPlaceholderText(/Filter by model or request id/);
    fireEvent.change(input, { target: { value: "zzzz-no-match" } });

    expect(
      await screen.findByText("No requests match your filters"),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Next" })).not.toBeInTheDocument();
  });
});

describe("not found page", () => {
  it("renders a 404 card with a way back home", async () => {
    render(<App />);

    // The router is a module-level singleton; drive it directly.
    router.navigate("/does-not-exist");

    expect(await screen.findByText("Page not found")).toBeInTheDocument();

    fireEvent.click(
      await screen.findByRole("link", { name: "Back to overview" }),
    );
    expect(
      await screen.findAllByRole("heading", { name: "Overview" }),
    ).not.toHaveLength(0);
  });
});
