// @ts-nocheck
import { Asset, AssetAmount } from "../../entities";
import { getTestingTokens } from "../../test/utils/getTestingToken";
import { Swap, SwapArgs } from "./swap";
const [ROWAN, CATK] = getTestingTokens(["ROWAN", "CATK"]);

let getState: jest.Mock<any, any>;
let signAndBroadcast: jest.Mock<any, any>;
let swap: jest.Mock<any, any>;
let services: SwapArgs;
let dispatch: jest.Mock<any, any>;

const sentAmount = AssetAmount(ROWAN, "100");
const receivedAsset = Asset(CATK);
const minimumReceived = AssetAmount(CATK, "90");

beforeEach(() => {
  getState = jest.fn(() => ({ address: "sif12345871623548176253487612354" }));
  signAndBroadcast = jest.fn(() => Promise.resolve({ state: "accepted" }));
  swap = jest.fn(() => Promise.resolve());
  dispatch = jest.fn();
  services = {
    bus: { dispatch },
    sif: { getState, signAndBroadcast, loadNativeDexClient: signAndBroadcast },
    clp: { swap },
    ibc: {
      loadChainConfigByNetwork: jest.fn(),
    },
  };
});

test("Swap no address", async () => {
  getState.mockReturnValue({ address: undefined });
  const swapFn = Swap(services);
  expect(swapFn(sentAmount, receivedAsset, minimumReceived)).rejects.toEqual(
    new Error("No from address provided for swap"),
  );
});

test("Swap broadcasts msg value returned from service", async () => {
  swap.mockReturnValue(Promise.resolve({ value: { msg: "swap message" } }));
  const swapFn = Swap(services);

  await swapFn(sentAmount, receivedAsset, minimumReceived);

  expect(signAndBroadcast).toHaveBeenCalledWith("swap message");
});

test("Errors are reported", async () => {
  const myTxFailure = {
    code: 4,
    hash: "string",
    state: "failed",
    memo: "Darnit",
  };
  swap.mockReturnValue(Promise.resolve({ value: { msg: "swap message" } }));
  signAndBroadcast.mockReturnValue(Promise.resolve(myTxFailure));

  const swapFn = Swap(services);

  expect(await swapFn(sentAmount, receivedAsset, minimumReceived)).toEqual({
    code: 4,
    memo: "Darnit",
    hash: "string",
    state: "failed",
  });

  expect(dispatch).toHaveBeenCalledWith({
    payload: {
      message: "Darnit",
      txStatus: { code: 4, hash: "string", memo: "Darnit", state: "failed" },
    },
    type: "TransactionErrorEvent",
  });
});

test("edge case when user doesnt have enough balance", async () => {
  const myTxFailure = {
    code: 7,
    hash: "string",
    state: "failed",
    memo: "Darnit",
  };
  swap.mockReturnValue(Promise.resolve({ value: { msg: "swap message" } }));
  signAndBroadcast.mockReturnValue(Promise.resolve(myTxFailure));

  const swapFn = Swap(services);

  expect(await swapFn(sentAmount, receivedAsset, minimumReceived)).toEqual({
    code: 6,
    memo: "Not enough ROWAN to cover the gas fees",
    hash: "string",
    state: "failed",
  });
  expect(dispatch).toHaveBeenCalledWith({
    payload: {
      message: "Not enough ROWAN to cover the gas fees",
      txStatus: {
        code: 6,
        hash: "string",
        memo: "Not enough ROWAN to cover the gas fees",
        state: "failed",
      },
    },
    type: "TransactionErrorEvent",
  });
});
