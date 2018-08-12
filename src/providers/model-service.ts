import { DataFinder } from "./data-finder";
import { Injectable } from "../../node_modules/@angular/core";
import { DateParsePipe } from "./date-parse-pipe";


@Injectable()
export class ModelService {
  private modules: any;
  private status: string;
  private settings: settings;
  private currentFlow: number = 0;
  private modelInited: boolean;
  private events: asEvent[] = [];

  private icons: string[] = ["build", "water", "aperture", "cloud-outline", "wifi"];
  private devices: string[] = ["MP100 Leak Sensor", "FD100 Flood detector", "VS100 Valve shutoff", "BS100 Base Station", "R100 RF repater"];
  private statuses: string[] = ["Low Battery", "Tamper", "Communication", "All Good"];

  constructor(public dataFinder: DataFinder, public dateParsePipe: DateParsePipe) {
    console.log("constructor model-service");
    this.dataFinder.getJSONDataAsync("./assets/data/events.json").then(data => {
      this.setEventsData(data);
    });
  }

  /* Sets data with returned JSON array */
  private setEventsData(data: any): void {
    console.log("events length1 = " + this.events.length);
    for (let index = 0; index < data.length; index++) {
      this.events.push(data[index]);
    }
    this.events = this.sortEvents(this.events, false);
    console.log("events length2 = " + this.events.length);
  }

  public getStatus(): string {
    if (this.modules == null || this.modelInited != true) {
      this.prepareData();
    }
    return this.status;
  }

  public getModules(): module[] {
    if (this.modules == null || this.modelInited != true) {
      this.prepareData();
    }
    return this.modules;
  }

  public getSettings(): settings {
    return this.settings;
  }

  public getCurrentFlow(): number {
    return this.currentFlow;
  }

  public getEvents(): asEvent[] {
    if (this.modules == null || this.modelInited != true) {
      this.prepareData();
    }
    return this.events;
  }

  public getLatestOpenEvent(): asEvent {
    // console.log("getLatestOpenEvent");
    // console.dir(this.events);
    for (let index = 0; index < this.events.length; index++) {
      const element: asEvent = this.events[index];
      if (element.open) {
        return element;
      }
    }
  }

  public setCurrentFlow(f: number): void {
    console.log("setting current flow: " + f);
    this.currentFlow = f;
  }

  public toggleValve(sn: string, valveValue: boolean): void {
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

  public toggleAllValves(valveValue: boolean): void {
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

  public updateModelSetAllGood() {
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

  public updateSettings(settingsItemTitle: string, settingsItemValue: boolean): void {
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
        this.status = "leak";
        this.setCurrentFlow(19);
        for (let index = 0; index < this.modules.length; index++) {
          if (this.modules[index].type === 0) {
            this.modules[index].state = "Leak Detected";
            this.addLeakageEventToModel("MP100", this.formatDate(new Date()));
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
      if (state === "leak") {
        this.status = "leak";
        this.setCurrentFlow(19);
        this.addLeakageEventToModel("MP100", "04-07-2018 10:13");
      } else if (state === "warn") {
        this.status = "warn";
      } else {
        this.status = "good";
      }

      this.prepareSiteData();
      // this.prepareEvents();
      this.modelInited = true;
    }
  }

  // prepareEvents() {
  //   this.events = [];
  //   let numItems = Math.ceil(Math.random() * 8) + 5;
  //   let thisDate = new Date();
  //   for (let i = 0; i < numItems; i++) {
  //     thisDate = new Date(thisDate.getTime() - (1000 * (Math.ceil(Math.random() * 60 * 60 * 24) + 1)));
  //     let moment: eventMoment = {
  //       title: "detection",
  //       timestamp: this.formatDate(thisDate),
  //       initiator: "MP100"
  //     }
  //     this.events.push({
  //       title: "Leak Detected",
  //       timestamp: this.formatDate(thisDate),
  //       type: "leak",
  //       open: Math.random() > 0.5,
  //       moments: [moment]
  //     });
  //   }
  //   console.dir(this.events);
  // }

  private formatDate(date: Date): string {
    var curr_date = date.getDate();
    var curr_month = date.getMonth() + 1;
    var curr_year = date.getFullYear();
    let curr_hour = date.getHours();
    var curr_min = date.getMinutes();
    return this.prefixZeroIfNeeded(curr_date) + "-" + this.prefixZeroIfNeeded(curr_month) + "-" + curr_year + " " + this.prefixZeroIfNeeded(curr_hour) + ":" + this.prefixZeroIfNeeded(curr_min);
  }

  private prefixZeroIfNeeded(s: number): string {
    return (s < 10) ? "0" + s : "" + s;
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
    if (moduleType === 0 && this.status === "leak") {
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

  private addLeakageEventToModel(indicator: string, date: string): void {
    let moment: eventMoment = {
      title: "detection",
      timestamp: date,
      initiator: indicator
    }
    let event: asEvent = {
      title: "Leak Detection",
      timestamp: date,
      type: "leak",
      open: true,
      moments: [moment]
    };
    this.events.push(event);
    this.events = this.sortEvents(this.events, false);
    console.dir(this.events);
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

  private sortEvents(events: asEvent[], asc: boolean = true): asEvent[] {
    let result: asEvent[] = [];
    let tempArray = [];
    for (let index = 0; index < events.length; index++) {
      const element = events[index];
      tempArray.push({
        effectiveDate: this.getEffectiveDate(element),
        asEvent: element
      });
    }
    console.dir(tempArray);
    tempArray.sort((n1, n2) => {
      if (n1.effectiveDate > n2.effectiveDate) {
        return asc ? 1 : -1;
      }

      if (n1.effectiveDate < n2.effectiveDate) {
        return asc ? -1 : 1;
      }

      return 0;
    });
    // console.dir(tempArray);
    for (let index = 0; index < tempArray.length; index++) {
      const element = tempArray[index];
      result.push(element.asEvent);
    }
    return result;
  }

  private getEffectiveDate(event: asEvent): Date {
    // console.log("date0= " + event.moments[0].timestamp);
    let res = this.dateParsePipe.transform(event.moments[event.moments.length - 1].timestamp);
    // console.log("date3= " + res);
    return res;
  }
}