# The gateway-api Functional Specification

This document describes at a high level gateway-api's purpose and specifically 
what each API route does when used by a client.

# Purpose

The gateway-api exposes common operations needed from various blockchains and 
decentralized exchanges. Often the official and best maintained SDKs for these 
projects are written in JavaScript. 

While it is possible to interoperate with JavaScript via FFI software in 
languages like Python, Go, C++, etc., the cost of maintenance for multiple FFIs 
is high. A much simpler approach is to expose the functionality via an API 
server that the client runs locally and use HTTP to use the JavaScript 
libraries. This is the approach that gateway-api uses.

CoinAlpha uses gateway-api for 
[hummingbot](https://github.com/CoinAlpha/hummingbot). However, gateway-api can 
be integrated into other projects that need the same functionality that 
gateway-api exposes. gateway-api is an open-source project. The community is 
welcome to fork it and extend its functionality as needed. gateway-api is open
to community PRs.

# API Route Specifications

- [Terra](./terra.md)
