/*
  Hummingbot Utils
*/

const latency = (startTime, endTime) => parseFloat((endTime - startTime)/1000);

const strToDecimal = (str) => parseInt(str)/100;

module.exports = {
  latency,
  strToDecimal,
};