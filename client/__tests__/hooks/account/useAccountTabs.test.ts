import { renderHook } from "@testing-library/react";
import { useAccountTabs } from "@/hooks/account/useAccountTabs";
import "@testing-library/jest-dom";
import { useSearchParams, useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
  useRouter: jest.fn(),
}));

describe("useAccountTabs hook logic", () => {
  it("should initialize with proper tab from search params", () => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue("settings"),
    });

    const { result } = renderHook(() => useAccountTabs());

    expect(result.current.currentTab).toBe("settings");
  });

  it("should update currentTabs when searchParams changes", () => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue("details"),
    });
    const { rerender, result } = renderHook(() => useAccountTabs());

    expect(result.current.currentTab).toBe("details");

    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue("settings"),
    });

    rerender();

    expect(result.current.currentTab).toBe("settings");
  });
});
