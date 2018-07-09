import { Component } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

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



import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  data: any;
  icons: any;
  devices: any;

  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, private storage: Storage) {
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

    console.log('this.data.status = ' + this.data.status);
    this.storage.get('model').then((val) => { if (val != null) { console.log('val.status = ' + val.status); this.data = val;}});

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

    console.log('state=' + state);
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
      this.prepareWizardSteps();
    } else if (this.data.status === 3) {
      this.prepareSiteData(false);
    } else {
      this.prepareSiteData(true);
    }

    this.storage.set('model', this.data);
    console.log('set model in storage');
  }

  prepareSiteData(isAllGood) {
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

  prepareWizardSteps() {
    let wizardSteps = [];
    let wizIcons = ['assets/imgs/cool-52.png', 'assets/imgs/sad-50.png', 'assets/imgs/sad-50.png', 'assets/imgs/crying-50.png'];
    let wizActions = ['Respond', 'Quick Help', 'Quick Help', 'Help!'];
    let wizTitles = ['Not A Leak', 'I don\'t see a leak', 'I\'m not at home', 'I see a leak!'];
    for (let i = 0; i < wizTitles.length; i++) {
      wizardSteps.push({
        icon: wizIcons[i],
        title: wizTitles[i],
        action: wizActions[i],
        type: 100 + i
      });
    }
    this.data.wizardSteps = wizardSteps;
  }

  itemTapped(event, item) {
    let Pages = [MP100Page, Fd100Page, Vs100Page, Bs100Page, R100Page];
    console.log("item type = " + item.type);
    switch (item.type) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
        this.navCtrl.push(Pages[item.type], {
          item: item
        });
        break;
      case 100:
        this.navCtrl.push(NotALeakPage, {
          item: item,
          alert: this.data.alert
        });
        break;
      case 101:
        this.navCtrl.push(CantseeLeakPage, {
          item: item,
          alert: this.data.alert
        });
        break;
      case 102:
        this.navCtrl.push(NotathomePage, {
          item: item,
          alert: this.data.alert
        });
        break;
      case 103:
        this.navCtrl.push(IsALeakPage, {
          item: item,
          alert: this.data.alert
        });
        break;

      default:
        this.navCtrl.push(ModulePage, {
          item: item,
          alert: this.data.alert
        });
        break;
    }
  }

  handleToggleChange(evt, item) {
    if (evt.checked !== item.valve) {
      console.log("toggle1=" + item.valve);
      console.log("event2=" + event);

      let alert = this.alertCtrl.create({
        title: 'Confirmation',
        message: 'Are you sure you want to ' + (item.valve ? 'open' : 'close') + ' the main valve?',
        buttons: [
          {
            text: 'No',
            handler: () => {
              console.log('No clicked');
              item.valve = !item.valve;
            }
          },
          {
            text: 'Yes',
            handler: () => {
              console.log('Yes clicked');
              item.valve = evt.checked;
            }
          }
        ]
      });
      alert.present();
    }
  }
}
