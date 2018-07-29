export class ModelService {
  private model: any;
  private settings: any;
  private currentFlow: number = 0;

  private icons: string[] = ["build", "water", "aperture", "cloud-outline", "wifi"];
  private devices: string[] = ["MP100 Leak Sensor", "FD100 Flood detector", "VS100 Valve shutoff", "BS100 Base Station", "R100 RF repater"];
  private statuses: string[] = ["Low Battery", "Tamper", "Communication", "All Good"];

  constructor() {
    console.log("constructor");
  }

  getStatus(): any {
    if (this.model == null || this.model.inited != true) {
      this.prepareData();
    }
    return this.model.status;
  }

  getModules(): any {
    if (this.model == null || this.model.inited != true) {
      this.prepareData();
    }
    return this.model.modules;
  }

  getAlert(): any {
    if (this.model == null || this.model.inited != true) {
      this.prepareData();
    }
    return this.model.alert;
  }

  getSettings(): any {
    return this.settings;
  }

  getCurrentFlow(): number {
    return this.currentFlow;
  }

  setCurrentFlow(f: number): void {
    console.log("setting current flow: " + f);
    this.currentFlow = f;
  }

  toggleValve(sn: string, valveValue: boolean): void {
    for (let index = 0; index < this.model.modules.length; index++) {
      if (this.model.modules[index].sn == sn) {
        this.model.modules[index].valve = valveValue;
        this.changeStateAccordingToValve(valveValue);
        if (!valveValue) {
          this.setCurrentFlow(0);
        }
        return;
      }
    }
  }

  toggleAllValves(valveValue: boolean): void {
    for (let index = 0; index < this.model.modules.length; index++) {
      if (this.model.modules[index].type == 2) {
        this.model.modules[index].valve = valveValue;
        this.changeStateAccordingToValve(valveValue);
        if (!valveValue) {
          this.setCurrentFlow(0);
        }
      }
    }
  }

  // private updateModel(module, property) {
  //   for (let index = 0; index < this.model.modules.length; index++) {
  //     if (this.model.modules[index].sn == module.sn) {
  //       this.model.modules[index][property] = module[property];
  //     }
  //   }
  // }

  updateModelSetAllGood() {
    if (this.model != null) {
      let isValveOpen = true;
      for (let index = 0; index < this.model.modules.length; index++) {
        this.model.modules[index].state = "All Good";
        if (this.model.modules[index].type == 2) {
          isValveOpen = this.model.modules[index].valve;
        }
      }
      this.model.status = isValveOpen ? "good" : "warn";
    }
  }

  updateSettings(settingsItemTitle, settingsItemValue) {
    if (this.model != null) {
      //set the settings object
      if (settingsItemTitle === "Leakage Alert") {
        this.settings.leakageAlert = settingsItemValue;
      }
      if (settingsItemTitle === "Irregularity Alert") {
        this.settings.irregularityAlert = settingsItemValue;
      }

      if (!settingsItemValue) {
        // in case of unset - change to All good
        this.updateModelSetAllGood();
        return;
      }

      // if we are here need to set leakage or warn
      if (settingsItemTitle === "Leakage Alert") {
        this.model.status = "bad";
        this.setCurrentFlow(19);
        for (let index = 0; index < this.model.modules.length; index++) {
          if (this.model.modules[index].type === 0) {
            this.model.modules[index].state = "Leak Detected";
            this.addAlertToModel("MP100", new Date().toISOString());
          }
        }
      }
      if (settingsItemTitle === "Irregularity Alert") {
        this.model.status = "warn";
        for (let index = 0; index < this.model.modules.length; index++) {
          this.model.modules[index].state = this.statuses[Math.floor(Math.random() * this.statuses.length)];
        }
      }
    }
  }

  private prepareData(): void {
    //init
    this.model = {};
    this.settings = {};
    //
    let state: string = "";
    if (document.URL.indexOf("?") > 0) {
      let splitURL = document.URL.split("?");
      let splitParams = splitURL[1].split("&");
      let i: any;
      for (i in splitParams) {
        let singleURLParam = splitParams[i].split("=");
        if (singleURLParam[0] == "state") {
          state = singleURLParam[1].toLowerCase();
        }
      }
    }

    if (this.model == null || !this.model.inited) {
      if (state === "bad") {
        this.model.status = "bad";
        this.setCurrentFlow(19);
      } else if (state === "warn") {
        this.model.status = "warn";
      } else {
        this.model.status = "good";
      }

      this.addAlertToModel("MP100", "4/7/2018 10:13");
      this.prepareSiteData();
      this.model.inited = true;
    }

    // console.dir(this.model);
  }

  private prepareSiteData(): void {
    let modules = [];
    // types 0=MP100, 1=FD100, 2=VS100
    modules.push(this.getModule(0));
    modules.push(this.getModule(2));
    modules.push(this.getModule(1));
    modules.push(this.getModule(1));
    modules.push(this.getModule(1));
    modules.push(this.getModule(1));

    this.model.modules = modules;
  }

  private getModule(type: number): any {
    let status = this.getModuleStatusByTypeAndSystemStatus(type);
    return {
      title: this.devices[type],
      state: status,
      icon: this.icons[type],
      type: type,
      valve: true,
      sn: this.getRandomSN()
    }
  }

  private getModuleStatusByTypeAndSystemStatus(moduleType: number): string {
    if (moduleType === 0 && this.model.status === "bad") {
      return "Leak Detected";
    } else {
      return (this.model.status != "warn" ? "All Good" : this.statuses[Math.floor(Math.random() * this.statuses.length)]);
    }
  }

  private getRandomSN(): string {
    let sn: string = "";
    for (var i = 0; i < 8; i++) {
      var num = Math.floor(Math.random() * 16);
      sn += num.toString(16);
    }
    return sn;
  }

  private addAlertToModel(indicator: string, date: string): void {
    let alert = {};
    alert["indicator"] = indicator;
    alert["detectionTime"] = date;
    this.model.alert = alert;
  }

  private isAllGood(): boolean {
    if (this.model != null) {
      for (let index = 0; index < this.model.modules.length; index++) {
        if (this.model.modules[index].state != "All Good") {
          return false;
        }
      }
    }
    return true;
  }

  private changeStateAccordingToValve(valveValue: boolean): void {
    if (valveValue) {
      if (this.isAllGood()) {
        this.model.status = "good";
      }
    } else {
      if (this.model.status === "good") {
        this.model.status = "warn"
      }
    }
  }

}