export class ModelService {
  private modules: module[];
  private alert: alert;
  private status: string;
  private settings: settings;
  private currentFlow: number = 0;
  private modelInited: boolean;
  private events: event[];

  private icons: string[] = ["build", "water", "aperture", "cloud-outline", "wifi"];
  private devices: string[] = ["MP100 Leak Sensor", "FD100 Flood detector", "VS100 Valve shutoff", "BS100 Base Station", "R100 RF repater"];
  private statuses: string[] = ["Low Battery", "Tamper", "Communication", "All Good"];

  constructor() {
    console.log("constructor");
  }

  getStatus(): string {
    if (this.modules == null || this.modelInited != true) {
      this.prepareData();
    }
    return this.status;
  }

  getModules(): module[] {
    if (this.modules == null || this.modelInited != true) {
      this.prepareData();
    }
    return this.modules;
  }

  getAlert(): alert {
    if (this.modules == null || this.modelInited != true) {
      this.prepareData();
    }
    return this.alert;
  }

  getSettings(): settings {
    return this.settings;
  }

  getCurrentFlow(): number {
    return this.currentFlow;
  }

  getEvents(): event[] {
    if (this.modules == null || this.modelInited != true) {
      this.prepareData();
    }
    return this.events;
  }
  setCurrentFlow(f: number): void {
    console.log("setting current flow: " + f);
    this.currentFlow = f;
  }

  toggleValve(sn: string, valveValue: boolean): void {
    for (let index = 0; index < this.modules.length; index++) {
      if (this.modules[index].sn == sn) {
        this.modules[index].valve = valveValue;
        this.changeStateAccordingToValve(valveValue);
        if (!valveValue) {
          this.setCurrentFlow(0);
        }
        return;
      }
    }
  }

  toggleAllValves(valveValue: boolean): void {
    for (let index = 0; index < this.modules.length; index++) {
      if (this.modules[index].type == 2) {
        this.modules[index].valve = valveValue;
        this.changeStateAccordingToValve(valveValue);
        if (!valveValue) {
          this.setCurrentFlow(0);
        }
      }
    }
  }

  // private updateModel(module, property) {
  //   for (let index = 0; index < this.modules.length; index++) {
  //     if (this.modules[index].sn == module.sn) {
  //       this.modules[index][property] = module[property];
  //     }
  //   }
  // }

  updateModelSetAllGood() {
    if (this.modules != null) {
      let isValveOpen = true;
      for (let index = 0; index < this.modules.length; index++) {
        this.modules[index].state = "All Good";
        if (this.modules[index].type == 2) {
          isValveOpen = this.modules[index].valve;
        }
      }
      this.status = isValveOpen ? "good" : "warn";
    }
  }

  updateSettings(settingsItemTitle: string, settingsItemValue: boolean): void {
    if (this.modules != null) {
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
        this.status = "bad";
        this.setCurrentFlow(19);
        for (let index = 0; index < this.modules.length; index++) {
          if (this.modules[index].type === 0) {
            this.modules[index].state = "Leak Detected";
            this.addAlertToModel("MP100", new Date().toISOString());
          }
        }
      }
      if (settingsItemTitle === "Irregularity Alert") {
        this.status = "warn";
        for (let index = 0; index < this.modules.length; index++) {
          this.modules[index].state = this.statuses[Math.floor(Math.random() * this.statuses.length)];
        }
      }
    }
  }

  private prepareData(): void {
    //init
    this.modules = [];
    this.settings = {
      leakageAlert: false,
      irregularityAlert: false
    };
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

    if (this.modules == null || !this.modelInited) {
      if (state === "bad") {
        this.status = "bad";
        this.setCurrentFlow(19);
      } else if (state === "warn") {
        this.status = "warn";
      } else {
        this.status = "good";
      }

      this.addAlertToModel("MP100", "4/7/2018 10:13");
      this.prepareSiteData();
      this.prepareEvents();
      this.modelInited = true;
    }

    // console.dir(this.model);
  }

  prepareEvents() {
    this.events = [];
    let numItems = Math.ceil(Math.random() * 8) + 5;
    let thisDate = new Date();
    for (let i = 0; i < numItems; i++) {
      thisDate = new Date(thisDate.getTime() - (1000 * (Math.ceil(Math.random() * 60 * 60 * 24) + 1)));
      let moment: eventMoment = {
        title: "detection",
        timestamp: this.formatDate(thisDate),
        initiator: "MP100"
      }
      this.events.push({
        title: "Leak Detected",
        timestamp: this.formatDate(thisDate),
        type: "leak",
        open: Math.random() > 0.5,
        moments: [moment]
      });
    }
    console.dir(this.events);
  }

  private formatDate(date: Date) : string {
    var curr_date = date.getDate();
    var curr_month = date.getMonth();
    var curr_year = date.getFullYear();
    let curr_hour = date.getHours();
    let curr_hour_st = (curr_hour < 10) ? "0" + curr_hour : curr_hour;
    var curr_min = date.getMinutes();
    let curr_min_st = (curr_min < 10) ? "0" + curr_min : curr_min;
    return curr_date + "-" + curr_month + "-" + curr_year + " " + curr_hour_st + ":" + curr_min_st;
  }

  private prepareSiteData(): void {
    let modules: module[] = [];
    // types 0=MP100, 1=FD100, 2=VS100
    modules.push(this.getModule(0));
    modules.push(this.getModule(2));
    modules.push(this.getModule(1));
    modules.push(this.getModule(1));
    modules.push(this.getModule(1));
    modules.push(this.getModule(1));

    this.modules = modules;
  }

  private getModule(type: number): module {
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
    if (moduleType === 0 && this.status === "bad") {
      return "Leak Detected";
    } else {
      return (this.status != "warn" ? "All Good" : this.statuses[Math.floor(Math.random() * this.statuses.length)]);
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
    this.alert = {
      indicator: indicator,
      detectionTime: date
    };
  }

  private isAllGood(): boolean {
    if (this.modules != null) {
      for (let index = 0; index < this.modules.length; index++) {
        if (this.modules[index].state != "All Good") {
          return false;
        }
      }
    }
    return true;
  }

  private changeStateAccordingToValve(valveValue: boolean): void {
    if (valveValue) {
      if (this.isAllGood()) {
        this.status = "good";
      }
    } else {
      if (this.status === "good") {
        this.status = "warn"
      }
    }
  }

}