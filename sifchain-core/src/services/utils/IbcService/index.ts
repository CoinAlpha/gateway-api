export const isIBCDenom = (denom: string) => {
  return denom.startsWith("ibc/");
};
