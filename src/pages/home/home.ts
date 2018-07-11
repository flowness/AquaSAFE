import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';

import { MP100Page } from '../modules/mp100/mp100';
import { Fd100Page } from '../modules/fd100/fd100';
import { Vs100Page } from '../modules/vs100/vs100';
import { Bs100Page } from '../modules/bs100/bs100';
import { R100Page } from '../modules/r100/r100';
import { ModulePage } from '../module/module';

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

  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, private storage: Storage, public loadingCtrl: LoadingController) {
    console.log('constructor');
    this.data = {};
    this.icons = ['build', 'water', 'aperture', 'cloud-outline', 'wifi'];
    this.devices = ['MP100 Leak Sensor', 'FD100 Flood detector', 'VS100 Valve shutoff', 'BS100 Base Station', 'R100 RF repater']
    console.log('constructor finished');
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad');

    let loading = this.loadingCtrl.create({
      content: 'Refreshing.', showBackdrop:false
    });
    loading.present();
    this.readData(loading);
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
    console.log('data1=' + this.data);
    if (this.data == null || !this.data.inited) {
      if (state === 'bad') {
        this.data.status = 2;
      } else if (state === 'warn') {
        this.data.status = 3;
      } else if (state === 'good') {
        this.data.status = 1;
      } else {
        this.data.status = Math.floor(Math.random() * 3) + 1;
        console.log("random state = " + this.data.status);
      }
  
      if (this.data.status === 2) {
        this.prepareAlertData();
      } else if (this.data.status === 3) {
        this.prepareSiteData();
      } else {
        this.prepareSiteData();
      }
      this.data.inited = true;
    }

    console.log('finished prepare');
    console.dir(this.data);
    this.persistData();
  }

  prepareSiteData() {
    // let systemStatus = this.data.status;
    let isAllGood = true;
    // if (systemStatus === 3) {
    //     isAllGood = false;
    // }
    let statuses = ['Low Battery', 'Tamper', 'Communication', 'All Good'];
    let items = [];
    // types 0=MP100, 1=FD100, 2=VS100
    items.push(this.getItem(0, (isAllGood ? 'All Good' : statuses[Math.floor(Math.random() * statuses.length)])));
    items.push(this.getItem(2, (isAllGood ? 'All Good' : statuses[Math.floor(Math.random() * statuses.length)])));
    items.push(this.getItem(1, (isAllGood ? 'All Good' : statuses[Math.floor(Math.random() * statuses.length)])));
    items.push(this.getItem(1, (isAllGood ? 'All Good' : statuses[Math.floor(Math.random() * statuses.length)])));
    items.push(this.getItem(1, (isAllGood ? 'All Good' : statuses[Math.floor(Math.random() * statuses.length)])));
    items.push(this.getItem(1, (isAllGood ? 'All Good' : statuses[Math.floor(Math.random() * statuses.length)])));

    this.data.items = items;
  }

  getItem(type, status) {
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

  itemTapped(event, item) {
    let Pages = [MP100Page, Fd100Page, Vs100Page, Bs100Page, R100Page];
    console.log("item type = " + item.type);
    this.navCtrl.push(Pages[item.type], {
      item: item
    });
}

  eventItemTapped(event, eventType) {
    console.log("item type = " + eventType);
    switch (eventType) {
      case 100:
        this.navCtrl.push(NotALeakPage, {
          // item: item,
          alert: this.data.alert
        });
        break;
      case 101:
        this.navCtrl.push(CantseeLeakPage, {
          // item: item,
          alert: this.data.alert
        });
        break;
      case 102:
        this.navCtrl.push(NotathomePage, {
          // item: item,
          alert: this.data.alert
        });
        break;
      case 103:
        this.navCtrl.push(IsALeakPage, {
          // item: item,
          alert: this.data.alert
        });
        break;
    }
  }

  handleToggleChange(checked, item) {
    console.log("toggle1=" + item.valve + ' checked=' + checked);
    if (checked === item.valve) {

      let alert = this.alertCtrl.create({
        title: 'Confirmation',
        message: 'Are you sure you want to ' + (item.valve ? 'open' : 'close') + ' the main valve?',
        buttons: [
          {
            text: 'No',
            handler: () => {
              console.log('No clicked');
              console.log('item sn= ' + item.sn);
              item.valve = !item.valve;
            }
          },
          {
            text: 'Yes',
            handler: () => {
              console.log('Yes clicked. checked = ' + checked);
              item.valve = checked;
              this.updateModel(item, 'valve');
            }
          }
        ]
      });
      alert.present();
    }
  }

  updateModel(item, property) {
    for (let index = 0; index < this.data.items.length; index++) {
      if (this.data.items[index].sn == item.sn) {
        this.data.items[index][property] = item[property];
        this.persistData();
      }
    };
  }

  persistData(){
    console.log('set model in storage');
    console.dir(this.data);
    this.storage.set('model', this.data);
  }

  readData(loading){
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
