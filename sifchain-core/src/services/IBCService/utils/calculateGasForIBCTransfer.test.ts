import {
  calculateGasForIBCTransfer,
  gasSample,
} from "./calculateGasForIBCTransfer";

describe(`IBCService/utils.calculateGasForIBCTransfer()`, () => {
  it("is correct with exact sample", () => {
    const sampleItem = gasSample[3];
    const gas = calculateGasForIBCTransfer(sampleItem.transferMsgCount);
    expect(gas).toBe(sampleItem.gas.toString());
  });
  it("is between with between sample", () => {
    const item1 = gasSample[3];
    const item2 = gasSample[4];
    const gas = calculateGasForIBCTransfer(
      Math.floor((item1.transferMsgCount + item2.transferMsgCount) / 2),
    );
    expect(+gas).toBeGreaterThan(+item1.gas);
    expect(+gas).toBeLessThan(+item2.gas);
  });
  it("is large with out of range sample", () => {
    const sampleItem = gasSample[gasSample.length - 1];
    const gas = calculateGasForIBCTransfer(sampleItem.transferMsgCount * 100);
    expect(+gas).toBeGreaterThan(sampleItem.gas);
  });
});
