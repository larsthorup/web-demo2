import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import App, { AlbumPicker } from "./App";
import userEvent from "@testing-library/user-event";
import mockResponse from "./mockResponse.json";
import { debug } from "vitest-preview";

describe(App.name, () => {
  test("should render", () => {
    render(<App />);

    expect(screen.getByText("Vite and React")).toBeInTheDocument();
    expect(screen.getByLabelText("Artist name:")).toBeInTheDocument();
  });
});

describe('AlbumPicker', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("should show search results when a valid artist is entered", async () => {
    const mockFetch = vi.spyOn(window, "fetch").mockImplementation(async () => {
      return {
        json: async () => mockResponse,
      } as Response;
    });
    const user = userEvent.setup();
    render(<AlbumPicker />);

    const input = screen.getByLabelText("Artist name:") as HTMLInputElement;
    await user.type(input, "rihanna");
    fireEvent.submit(screen.getByLabelText("search"));
    // const form = screen.getByRole("form", { name: "search" });
    // fireEvent.submit(form);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    debug();
    expect(await screen.findByText("Umbrella")).toBeInTheDocument();
    expect(mockFetch).toHaveBeenCalledWith('https://musicbrainz.org/ws/2/release?fmt=json&query=artist:rihanna');
  });
});