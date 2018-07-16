import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';

import { MP100Page } from '../modules/mp100/mp100';
import { Fd100Page } from '../modules/fd100/fd100';
import { Vs100Page } from '../modules/vs100/vs100';
import { Bs100Page } from '../modules/bs100/bs100';
import { R100Page } from '../modules/r100/r100';

import { CantseeLeakPage } from '../events/cantseeleak/cantseeleak';
import { IsALeakPage } from '../events/isaleak/isaleak';
import { NotALeakPage } from '../events/notaleak/notaleak';
import { NotathomePage } from '../events/notathome/notathome';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  data: any;
  icons: any;
  devices: any;
  statuses = ['Low Battery', 'Tamper', 'Communication', 'All Good'];

  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, private storage: Storage, public loadingCtrl: LoadingController) {
    console.log('constructor');
    this.data = {};
    this.icons = ['build', 'water', 'aperture', 'cloud-outline', 'wifi'];
    this.devices = ['MP100 Leak Sensor', 'FD100 Flood detector', 'VS100 Valve shutoff', 'BS100 Base Station', 'R100 RF repater']
    console.log('constructor finished');
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter');
    let loading = this.loadingCtrl.create({
      content: 'Refreshing.', showBackdrop: false
    });
    loading.present();
    this.readData(loading);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad');
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
    if (this.data == null || !this.data.inited) {
      if (state === 'bad') {
        this.data.status = 2;
      } else if (state === 'warn') {
        this.data.status = 3;
      } else {
        this.data.status = 1;
      }

      this.prepareAlertData();
      this.prepareSiteData();
      this.data.inited = true;
    }

    console.log('finished prepare');
    console.dir(this.data);
    this.persistData();
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

    this.data.modules = modules;
  }

  getModuleStatusByTypeAndSystemStatus(moduleType) {
    if (moduleType === 0 && this.data.status === 2) {
      return 'Leak Detected';
    } else {
      return (this.data.status != 3 ? 'All Good' : this.statuses[Math.floor(Math.random() * this.statuses.length)]);
    }
  }

  getModule(type) {
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

  prepareAlertData() {
    let alert = {};
    alert['indicator'] = 'MP100';
    alert['detectionTime'] = '4/7/2018 10:13';
    this.data.alert = alert;
  }

  getRandomSN() {
    let sn = '';
    for (var i = 0; i < 8; i++) {
      var num = Math.floor(Math.random() * 16);
      sn += num.toString(16);
    }
    return sn;
  }

  moduleTapped(event, module) {
    let Pages = [MP100Page, Fd100Page, Vs100Page, Bs100Page, R100Page];
    console.log("module type = " + module.type);
    this.navCtrl.push(Pages[module.type], {
      module: module
    });
  }

  eventItemTapped(event, eventType) {
    console.log("item type = " + eventType);
    switch (eventType) {
      case 100:
        this.navCtrl.push(NotALeakPage, {
          alert: this.data.alert
        });
        break;
      case 101:
        this.navCtrl.push(CantseeLeakPage, {
          alert: this.data.alert
        });
        break;
      case 102:
        this.navCtrl.push(NotathomePage, {
          alert: this.data.alert
        });
        break;
      case 103:
        this.navCtrl.push(IsALeakPage, {
          alert: this.data.alert
        });
        break;
    }
  }

  handleToggleChange(checked, module) {
    console.log("toggle1=" + module.valve + ' checked=' + checked);
    if (checked === module.valve) {

      let alert = this.alertCtrl.create({
        title: 'Confirmation',
        message: 'Are you sure you want to ' + (module.valve ? 'open' : 'close') + ' the main valve?',
        buttons: [
          {
            text: 'No',
            handler: () => {
              console.log('No clicked');
              console.log('module sn= ' + module.sn);
              module.valve = !module.valve;
            }
          },
          {
            text: 'Yes',
            handler: () => {
              console.log('Yes clicked. checked = ' + checked);
              module.valve = checked;
              this.updateModel(module, 'valve');
            }
          }
        ]
      });
      alert.present();
    }
  }

  updateModel(module, property) {
    for (let index = 0; index < this.data.modules.length; index++) {
      if (this.data.modules[index].sn == module.sn) {
        this.data.modules[index][property] = module[property];
        this.persistData();
      }
    };
  }

  persistData() {
    console.log('set model in storage');
    console.dir(this.data);
    this.storage.set('model', this.data);
  }

  readData(loading) {
    console.log('read model from storage');
    this.storage.get('model').then((val) => {
      if (val != null) {
        console.log('val.status = ' + val.status);
        this.data = val;
        console.dir(this.data);
      } else {
        this.prepareData();
      }
      loading.dismiss();
    });
  }
}
