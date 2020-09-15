/*
  Hummingbot Utils
*/

const latency = (startTime, endTime) => parseFloat((endTime - startTime)/1000);

module.exports = {
  latency
};