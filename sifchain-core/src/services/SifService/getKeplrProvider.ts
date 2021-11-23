import { OfflineSigner } from "@cosmjs/launchpad";
import { sleep } from "../../test/utils/sleep";
import { Window as KeplrWindow, Keplr } from "@keplr-wallet/types";
type WindowWithPossibleKeplr = typeof window & KeplrWindow;

// Mock out Keplr roughly. TODO import types

type provider = Keplr;
let numChecks = 0;

// Detect mossible keplr provider from browser
export default async function getKeplrProvider(): Promise<provider | null> {
  const window = globalThis.window || global;
  if (typeof window === "undefined") return null;

  const win = window as WindowWithPossibleKeplr;

  if (!win) {
    console.log("window not found", win);
    return null;
  }

  if (!win.keplr || !win.getOfflineSigner) {
    numChecks++;
    if (numChecks > 1000) {
      console.warn(`keplr not found`);
      return null;
    }
    await sleep(100);
    return getKeplrProvider();
  }

  numChecks = 0;
  return win.keplr;
}
