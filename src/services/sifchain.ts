const globalConfig =
  require('../services/configuration_manager').configManagerInstance;

// constants

export default class Sifchain {
  private lcdUrl;

  constructor() {
    this.lcdUrl = globalConfig.getConfig('SIFCHAIN_LCD_URL');
  }
  getLCDURL(): string {
    return this.lcdUrl;
  }
}
