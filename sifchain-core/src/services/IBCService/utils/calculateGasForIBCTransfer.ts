import JSBI from "jsbi";
import Long from "long";

export const gasSample: {
  transferMsgCount: number;
  gas: number;
}[] = [
  {
    transferMsgCount: 0,
    gas: 0,
  },
  {
    transferMsgCount: 1,
    gas: 99048,
  },
  {
    transferMsgCount: 2,
    gas: 110910,
  },
  {
    transferMsgCount: 16,
    gas: 545506,
  },
  {
    transferMsgCount: 32,
    gas: 1100914,
  },
  {
    transferMsgCount: 128,
    gas: 3895936,
  },
  {
    transferMsgCount: 256,
    gas: 7791872,
  },
];

const GAS_COEFF = 1.3;

export function calculateGasForIBCTransfer(x: number) {
  let y = 0;
  for (let [gasIndex, gasPoint] of gasSample.entries()) {
    if (gasIndex == 0) continue;
    const y1 = gasSample[gasIndex - 1].gas * GAS_COEFF;
    const y2 = gasPoint.gas * GAS_COEFF;
    const x1 = gasSample[gasIndex - 1].transferMsgCount;
    const x2 = gasPoint.transferMsgCount;
    if (x > x1) {
      const m = (y2 - y1) / (x2 - x1);
      const b = y1 - m * x1;
      y = m * x + b;
    }
  }
  return y.toString();
}
