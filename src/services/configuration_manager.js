/*
The essence if this class is to  maintain a persistent configuraion instance from
a global configuraion file.
*/
import YAML from 'yaml';
import fs from 'fs';

const GlobalConfigFilePath = './conf/global_conf.yml';

export default class ConfigurationManager {
  constructor() {
    try {
      this.globalConfFile = fs.readFileSync(GlobalConfigFilePath, 'utf8');
    } catch (err) {
      fs.copyFileSync(GlobalConfigFilePath + '.example', GlobalConfigFilePath);
      this.globalConfFile = fs.readFileSync(GlobalConfigFilePath, 'utf8');
    }
    this.configs = YAML.parseDocument(this.globalConfFile);
    this.fileWatcher();
  }

  readAllConfigs() {
    return this.configs.toJSON();
  }

  updateConfig(data) {
    // Hummingbot client will ideally make 1 update per request.
    // However, other softwares using gateway may be designed to update multiple configs per request. Hence, the reason for iterating.
    let toExit = false;
    Object.keys(data).forEach((key) => {
      if (this.configs.get('CORE').has(key)) {
        toExit = true;
        this.configs.get('CORE').set(key, data[key]);
      } else {
        this.configs.set(key, data[key]);
      }
    });
    fs.writeFileSync(GlobalConfigFilePath, this.configs.toString());

    if (toExit) {
      process.exit(1);
    }

    // For now, Gateway will always restart whenever any config is updated.
    // This behavior will be removed after support for multichain is added
    process.exit(1);
  }

  getConfig(key) {
    return this.configs.get(key);
  }

  getCoreConfig(key) {
    return this.configs.get('CORE').get(key);
  }

  fileWatcher() {
    fs.watchFile(
      GlobalConfigFilePath,
      { persistent: true, interval: 1000 },
      (curr, prev) => {
        if (prev.mtime !== curr.mtime) {
          const newConfigs = YAML.parseDocument(
            fs.readFileSync(GlobalConfigFilePath, 'utf8')
          );
          if (
            JSON.stringify(this.readAllConfigs().CORE) ===
            JSON.stringify(newConfigs.toJSON().CORE)
          ) {
            this.configs = newConfigs;
          } else {
            // restart gateway
            process.exit(1);
          }

          // For now, Gateway will always restart whenever any config is updated.
          // This behavior will be removed after support for multichain is added
          process.exit(1);
        }
      }
    );
  }
}

export const configManagerInstance = new ConfigurationManager();
