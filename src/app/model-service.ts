export class ModelService {
  private model: any;
  private settings: any;

  private statuses = ['Low Battery', 'Tamper', 'Communication', 'All Good'];

  constructor() {
    console.log('constructor');
  }

  getModel(): any {
    if (this.model != null && this.model.inited == true) {
      console.log('data.status = ' + this.model.status);
    } else {
      this.prepareData();
    }
    return this.model;
  }

  setModel(model: any) {
    this.model = model;
  }

  getSettings(): any {
    return this.settings;
  }

  setSettings(settings: any) {
    this.settings = settings;
  }

  prepareData() {
    let state = '';
    if (document.URL.indexOf("?") > 0) {
      let splitURL = document.URL.split("?");
      let splitParams = splitURL[1].split("&");
      let i: any;
      for (i in splitParams) {
        let singleURLParam = splitParams[i].split('=');
        if (singleURLParam[0] == "state") {
          state = singleURLParam[1].toLowerCase();
        }
      }
    }

    console.log('state1=' + state);
    if (this.model == null || !this.model.inited) {
      if (state === 'bad') {
        this.model.status = 'bad';
      } else if (state === 'warn') {
        this.model.status = 'warn';
      } else {
        this.model.status = 'good';
      }

      this.prepareAlertData();
      this.prepareSiteData();
      this.model.inited = true;
    }

    console.log('finished prepare');
    console.dir(this.model);
  }

  prepareSiteData() {
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

  getModule(type) {
    let status = this.getModuleStatusByTypeAndSystemStatus(type);
    return {
      title: this.getDevices()[type],
      state: status,
      icon: this.getIcons()[type],
      type: type,
      valve: true,
      sn: this.getRandomSN()
    }
  }

  getModuleStatusByTypeAndSystemStatus(moduleType) {
    if (moduleType === 0 && this.model.status === 'bad') {
      return 'Leak Detected';
    } else {
      return (this.model.status != 'warn' ? 'All Good' : this.statuses[Math.floor(Math.random() * this.statuses.length)]);
    }
  }

  getRandomSN() {
    let sn = '';
    for (var i = 0; i < 8; i++) {
      var num = Math.floor(Math.random() * 16);
      sn += num.toString(16);
    }
    return sn;
  }

  prepareAlertData() {
    let alert = {};
    alert['indicator'] = 'MP100';
    alert['detectionTime'] = '4/7/2018 10:13';
    this.model.alert = alert;
  }

  updateModel(module, property) {
    for (let index = 0; index < this.model.modules.length; index++) {
      if (this.model.modules[index].sn == module.sn) {
        this.model.modules[index][property] = module[property];
      }
    };
  }

  getDevices() {
    //TODO: how can I make it class memeber
    return ['MP100 Leak Sensor', 'FD100 Flood detector', 'VS100 Valve shutoff', 'BS100 Base Station', 'R100 RF repater'];
  }

  getIcons() {
    //TODO: how can I make it class memeber
    return ['build', 'water', 'aperture', 'cloud-outline', 'wifi'];
  }

}