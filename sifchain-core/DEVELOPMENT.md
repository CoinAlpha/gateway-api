# Testing

To run unit tests, run `yarn test`.

To run integration tests (tests bridging, full testnet environment, etc), run `yarn test:integration`.

To run integration tests, you have to have a COUNTERPARTY_TEST_MNEMONIC environment variable set. This mnemonic will be used to pull counterparty test tokens for IBC transfers.

It is currently used in IBCBridge.integration-test.ts to transfer new Testnet AKT tokens to each new test run's wallet.
