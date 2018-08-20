import { DataFinder } from "./data-finder";
import { Injectable } from "../../node_modules/@angular/core";
import { DateParsePipe } from "./date-parse-pipe";
import { EventStatus, ModuleType } from "../lib/enums";
import {
  settings,
  asEvent,
  moduleData,
  eventMoment,
  module
} from "../lib/interfaces";

@Injectable()
export class ModelService {
  private modelInited: boolean;

  private modules: module[];
  private status: string;
  private settings: settings;
  private currentFlow: number = 0;
  private events: asEvent[] = [];

  private icons: string[] = [
    "build",
    "water",
    "aperture",
    "cloud-outline",
    "wifi"
  ];
  private devices: string[] = [
    "MP100 Leak Sensor",
    "FD100 Flood detector",
    "VS100 Valve shutoff",
    "BS100 Base Station",
    "R100 RF repeater"
  ];
  private statuses: string[] = [
    "Low Battery",
    "Tamper",
    "Communication",
    "All Good"
  ];

  constructor(
    public dataFinder: DataFinder,
    public dateParsePipe: DateParsePipe
  ) {
    console.log("constructor model-service");
    this.dataFinder.getJSONDataAsync("./assets/data/events.json").then(data => {
      this.setEventsData(data);
    });
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

  public getCountOpenEvents(): number {
    let count: number = 0;
    for (let index = 0; index < this.events.length; index++) {
      const element: asEvent = this.events[index];
      if (element.open) {
        count++;
      }
    }
    return count;
  }

  public getLatestOpenEvent(): asEvent {
    // console.log("getLatestOpenEvent");
    // console.dir(this.events);
    for (let index = 0; index < this.events.length; index++) {
      const element: asEvent = this.events[index];
      if (EventStatus.isOpenStatus(element.status)) {
        return element;
      }
    }
  }

  public getShutOffValveStatus(): boolean {
    for (let index = 0; index < this.modules.length; index++) {
      if (this.modules[index].type === ModuleType.VS100) {
        return this.modules[index].valve;
      }
    }
    return false;
  }

  public setCurrentFlow(f: number): void {
    console.log("setting current flow: " + f);
    this.currentFlow = f;
    if (f === 0) {
      this.unliveAnyLiveEvent("flow stopped");
    }
    this.updateSystemStatus();
  }

  public toggleValve(sn: string, valveValue: boolean): void {
    for (let index = 0; index < this.modules.length; index++) {
      if (this.modules[index].sn == sn) {
        this.modules[index].valve = valveValue;
        if (!valveValue) {
          this.setCurrentFlow(0);
        }
        break;
      }
    }
    this.updateSystemStatus();
  }

  public toggleAllValves(valveValue: boolean): void {
    for (let index = 0; index < this.modules.length; index++) {
      if (this.modules[index].type === ModuleType.VS100) {
        this.modules[index].valve = valveValue;
        if (!valveValue) {
          this.setCurrentFlow(0);
        }
      }
    }
    this.updateSystemStatus();
  }

  // private updateModel(module, property) {
  //   for (let index = 0; index < this.modules.length; index++) {
  //     if (this.modules[index].sn == module.sn) {
  //       this.modules[index][property] = module[property];
  //     }
  //   }
  // }

  public updateModelNotALeak() {
    this.unliveAnyLiveEvent("User - not a leak", "User", EventStatus.CLOSED);
    this.updateSystemStatus();
  }

  private updateModelSetAllGood() {
    if (this.modules != null) {
      for (let index = 0; index < this.modules.length; index++) {
        this.modules[index].state = "All Good";
      }
      this.updateSystemStatus();
    }
  }

  public getModuleData(sn: string): moduleData {
    return {
      sn: sn,
      lastReading: new Date(),
      address: "Haadarim St. Talmaz",
      batteryStatus: Math.floor(Math.random() * 100),
      tempC: Math.floor(Math.random() * 50) - 10
    };
  }

  public updateSettings(
    settingsItemTitle: string,
    settingsItemValue: boolean
  ): void {
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
        this.setCurrentFlow(19);
        for (let index = 0; index < this.modules.length; index++) {
          if (this.modules[index].type === ModuleType.MP100) {
            this.modules[index].state = "Leak Detected";
            this.addLeakageEventToModel("MP100", this.formatDate(new Date()));
          }
        }
      }
      if (settingsItemTitle === "Irregularity Alert") {
        for (let index = 0; index < this.modules.length; index++) {
          this.modules[index].state = this.statuses[
            Math.floor(Math.random() * this.statuses.length)
          ];
        }
      }
      this.updateSystemStatus();
    }
  }

  private unliveAnyLiveEvent(title: string, initiator: string = "MP100", toStatus: EventStatus = EventStatus.OPEN) {
    for (let index = 0; index < this.events.length; index++) {
      const element: asEvent = this.events[index];
      if (element.status === EventStatus.LIVE) {
        let moment: eventMoment = {
          title: title,
          timestamp: this.formatDate(new Date()),
          initiator: initiator
        };
        element.moments.push(moment);
        element.status = toStatus;
        if (toStatus === EventStatus.CLOSED) {
          element.open = false;
        }
        for (let j = 0; j < this.modules.length; j++) {
          const module: module = this.modules[j];
          if (module.type === ModuleType.MP100) {
            module.state = "All Good";
          }
          console.log("UNLIVE");
        }
      }
      this.events = this.sortEvents(this.events, false);
    }
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

  private updateSystemStatus() {
    let isAllGood: boolean = true;
    let isValveOpen: boolean = true;
    var hasLiveEvent: boolean = false;
    let hasOpenEvent: boolean = false;
    for (let index = 0; index < this.modules.length; index++) {
      if (this.modules[index].state != "All Good") {
        isAllGood = false;
      }
      if (this.modules[index].type === ModuleType.VS100) {
        isValveOpen = this.modules[index].valve;
      }
    }
    for (let index = 0; index < this.events.length; index++) {
      if (this.events[index].open) {
        hasOpenEvent = true;
      }
      if (this.events[index].status == EventStatus.LIVE) {
        hasLiveEvent = true;
      }
    }
    console.log(
      "System status: live:" +
      hasLiveEvent +
      " , open:" +
      hasOpenEvent +
      ", valve:" +
      isValveOpen +
      ", allgood:" +
      isAllGood
    );
    if (hasLiveEvent) {
      this.status = "leak";
      return;
    }
    if (hasOpenEvent || !isValveOpen || !isAllGood) {
      this.status = "warn";
      return;
    }
    this.status = "good";
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
        this.setCurrentFlow(19);
        this.addLeakageEventToModel("MP100", this.formatDate(new Date()));
      }

      this.prepareSiteData(state);
      // this.prepareEvents();
      this.modelInited = true;
    }
    this.updateSystemStatus();
  }

  private formatDate(date: Date): string {
    var curr_date = date.getDate();
    var curr_month = date.getMonth() + 1;
    var curr_year = date.getFullYear();
    let curr_hour = date.getHours();
    var curr_min = date.getMinutes();
    return (
      this.prefixZeroIfNeeded(curr_date) +
      "-" +
      this.prefixZeroIfNeeded(curr_month) +
      "-" +
      curr_year +
      " " +
      this.prefixZeroIfNeeded(curr_hour) +
      ":" +
      this.prefixZeroIfNeeded(curr_min)
    );
  }

  private prefixZeroIfNeeded(s: number): string {
    return s < 10 ? "0" + s : "" + s;
  }

  private prepareSiteData(configuredStatus: string): void {
    let modules: module[] = [];
    // types 0=MP100, 1=FD100, 2=VS100
    modules.push(this.getModule(ModuleType.MP100, configuredStatus));
    modules.push(this.getModule(ModuleType.VS100, configuredStatus));
    modules.push(this.getModule(ModuleType.FD100, configuredStatus));
    modules.push(this.getModule(ModuleType.FD100, configuredStatus));
    modules.push(this.getModule(ModuleType.FD100, configuredStatus));
    modules.push(this.getModule(ModuleType.FD100, configuredStatus));

    this.modules = modules;
  }

  private getModule(type: ModuleType, configuredStatus: string): module {
    let status = this.getModuleStatusByTypeAndSystemStatus(type, configuredStatus);
    return {
      title: this.devices[type],
      state: status,
      icon: this.icons[type],
      type: type,
      valve: true,
      sn: this.getRandomSN(type)
    };
  }

  private getModuleStatusByTypeAndSystemStatus(moduleType: ModuleType, configuredStatus: string): string {
    if (moduleType == ModuleType.MP100 && configuredStatus === "leak") {
      return "Leak Detected";
    } else {
      return configuredStatus != "warn"
        ? "All Good"
        : this.statuses[Math.floor(Math.random() * this.statuses.length)];
    }
  }

  private getRandomSN(type: ModuleType): string {
    let sn: string = type.toString();
    for (var i = 0; i < 3; i++) {
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
    };
    let event: asEvent = {
      title: "Leak Detection",
      timestamp: date,
      type: "leak",
      open: true,
      status: EventStatus.LIVE,
      moments: [moment]
    };
    this.events.push(event);
    this.events = this.sortEvents(this.events, false);
    console.dir(this.events);
  }

  // private isAllGood(): boolean {
  //   if (this.modules != null) {
  //     for (let index = 0; index < this.modules.length; index++) {
  //       if (this.modules[index].state != "All Good") {
  //         return false;
  //       }
  //     }
  //   }
  //   return true;
  // }

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
    let res = this.dateParsePipe.transform(
      event.moments[event.moments.length - 1].timestamp
    );
    // console.log("date3= " + res);
    return res;
  }
}
