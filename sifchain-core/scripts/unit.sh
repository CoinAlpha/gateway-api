#!/bin/bash

# insert args before flags allows us to target specific tests
yarn jest $@ --passWithNoTests --projects jest-unit.config.js
