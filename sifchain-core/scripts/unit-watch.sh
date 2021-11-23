#!/bin/bash

# insert args before flags allows us to target specific tests
yarn jest $@ --coverage --projects jest-unit.config.js --watch
