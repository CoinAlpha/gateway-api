export function isLikeSymbol(symbol1: string, symbol2: string) {
  symbol1 = symbol1.toLowerCase();
  symbol2 = symbol2.toLowerCase();
  const withoutPrefix = (s: string = "") => s.replace(/^(c|e|u)/, "");
  return (
    symbol1 === symbol2 ||
    withoutPrefix(symbol1) === symbol2 ||
    symbol1 === withoutPrefix(symbol2) ||
    withoutPrefix(symbol1) === withoutPrefix(symbol2)
  );
}
