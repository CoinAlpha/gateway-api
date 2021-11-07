const globalConfig =
  require('../services/configuration_manager').configManagerInstance;

// constants

export default class Sifchain {
  private lcdUrl;
  private basePath;

  constructor() {
    this.lcdUrl = globalConfig.getConfig('SIFCHAIN_LCD_URL');
    this.basePath = globalConfig.getConfig('SIFCHAIN_BASE_PATH');
  }
  getLCDURL(): string {
    return this.lcdUrl;
  }
  getBasePath(): string {
    return this.basePath;
  }
}
