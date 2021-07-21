# terra

Terra is a blockchain with smart contract support. It has a native, 
Uniswap-like market for a number of tokens:

- LUNA: the native Terra token
- TerraSDR: a basket of currencies collateralized by LUNA tokens
- Stablecoins: TerraKRW (Korean Won), TerraUSD (US Dollar), TerraMNT (Mongolian Tugrug)

The market can be accessed via the official 
[terra.js](https://github.com/terra-money/terra.js/) library. It is well 
[documented](https://docs.terra.money/). It is also accessible via a web browser at
[https://app.terraswap.io](https://app.terraswap.io).

The JavaScript library has an [oracle](https://docs.terra.money/dev/spec-oracle.html)
that gives price information about asset pairs and a
[market](https://docs.terra.money/dev/spec-market.html) interface.

# API Routes

## GET /terra

An informational route used to test that the connection to gateway-api is 
correct and view the Terra blockchain settings in gateway-api.

### Request

No parameters required.

### Response

```json
{
    "network": "tequila-0004",
    "lcdUrl": "https://tequila-lcd.terra.dev",
    "gasPrices": {
        "uluna": 0.16
    },
    "gasAdjustment": 1.4,
    "connection": true,
    "timestamp": 1626871045725
}
```

## POST /terra/price

### Request

TODO

### Response

TODO

## POST /terra/trade

### Request

TODO

### Response

TODO
