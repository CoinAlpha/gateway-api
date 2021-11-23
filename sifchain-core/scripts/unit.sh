#!/bin/bash

# insert args before flags allows us to target specific tests
yarn jest $@ --passWithNoTests --coverage --projects jest-unit.config.js
