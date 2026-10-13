import { vi } from "vitest";
import { configure } from "@testing-library/dom";
import "@testing-library/jest-dom/vitest";

// The simulated data load takes 420ms; give every async query room for it
// plus chunk loading on slower machines.
configure({ asyncUtilTimeout: 3000 });

// react-router's data router builds a `Request` on every navigation. Node's
// undici `Request` rejects AbortSignal instances created inside jsdom (they
// are from a different realm), which would fail every in-test navigation.
// Strip the signal — this app has no loaders, nothing reads it.
const RealRequest = globalThis.Request;
class SignalFreeRequest extends RealRequest {
  constructor(input: RequestInfo | URL, init?: RequestInit) {
    super(input, init ? { ...init, signal: undefined } : undefined);
  }
}
vi.stubGlobal("Request", SignalFreeRequest);
