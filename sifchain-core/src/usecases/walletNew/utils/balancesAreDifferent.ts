import { IAssetAmount } from "../../../entities";

export default function balancesAreDifferent(
  b1: IAssetAmount[],
  b2: IAssetAmount[],
) {
  const getAssetAmountKey = (balances: IAssetAmount[]) =>
    balances
      .map((b) => {
        return `${b.symbol}_${b.amount.toBigInt().toString()}`;
      })
      .join(" ");

  // Extremely naive check just so we don't spam state-setting with the exact same balance list.
  // Yes, if balances change order or are added/removed it will re-set the whole array. Don't care.
  return getAssetAmountKey(b1) !== getAssetAmountKey(b2);
}
