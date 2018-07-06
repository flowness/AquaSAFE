import { Component } from '@angular/core';
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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    console.log('constructor');
    this.data = {};
    this.data.mainValve =  true;
    this.icons = ['water','aperture','cloud-outline','wifi'];
    this.devices = ['FD100 Flood detector','VS100 Valve shutoff','BS100 Base Station','R100 RF repater']
    console.log('constructor finished');
  }

  ionViewWillEnter(){
    console.log('ionViewWillEnter');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad');
    let state = '';
    if (document.URL.indexOf("?") > 0) {
    	let splitURL = document.URL.split("?");
    	let splitParams = splitURL[1].split("&");
    	let i: any;
    	for (i in splitParams){
    		let singleURLParam = splitParams[i].split('=');
    		if (singleURLParam[0] == "state"){
    			state = singleURLParam[1].toLowerCase();
    		}
      }
    }

    console.log('state='+state);
    if (state ==='bad'){
      this.data.status = 2;
    } else if (state==='warn'){
      this.data.status = 3;
    } else if (state==='good'){
      this.data.status = 1;
    } else {
      this.data.status = Math.floor(Math.random() * 3) + 1;
      console.log("random state = " + this.data.status);
    }

    if (this.data.status === 2){
      this.prepareAlertData();
      this.prepareWizardSteps();
    } else if (this.data.status === 3){
      this.prepareSiteData(false);
    } else {
      this.prepareSiteData(true);
    }

    console.log('this.data.status='+this.data.status);
  }

  prepareSiteData(isAllGood){
    let items = [];
    // init the MP100 unit
    items.push(this.getMP100Item('All Good'));

    let numItems = Math.ceil(Math.random() * 8) + 2;
    let statuses = ['Battery', 'Check', 'Good'];
    let unitCount=[0,4,4,1,2]; //FD,VS,BS,R
    for (let i = 2; i < numItems; i++) {
      items.push(this.getItem(unitCount, isAllGood ? 'All Good' : statuses[Math.floor(Math.random() * statuses.length)]));
    }
    this.data.items = items;
  }

  getItem(unitCount, status) {
    let type=0;
    do {
      type=Math.floor(Math.random()*4)+1;
      if(unitCount[type]>0)
      {
        unitCount[type]--;
      }
      else
      {
        type=0
      }
    } while(type == 0)

    return {
      title: this.devices[type-1],
      state: status,
      icon: this.icons[type-1],
      type: type,
      sn: this.getRandomSN()
    }
  }

  getMP100Item(status) {
      return {
        title: 'MP100 Leak Sensor',
        state: status,
        icon: 'build',
        type: 0,
        sn: this.getRandomSN()
      }
  }

  prepareAlertData(){
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
    let wizIcons = ['../assets/imgs/cool-52.png', '../assets/imgs/sad-50.png', '../assets/imgs/sad-50.png', '../assets/imgs/crying-50.png'];
    let wizActions = ['Respond', 'Quick Help','Quick Help', 'Help!'];
    let wizTitles = ['Not A Leak', 'I don\'t see a leak', 'I\'m not at home', 'I see a leak!'];
    for (let i = 0; i < wizTitles.length; i++) {
      wizardSteps.push({
        icon: wizIcons[i],
        title: wizTitles[i],
        action: wizActions[i],
        type: 100+i
      });
    }
    this.data.wizardSteps = wizardSteps;
  }

  itemTapped(event, item) {
    let Pages=[MP100Page,Fd100Page,Vs100Page,Bs100Page,R100Page];
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

  change() {
    console.log("toggle=" + this.data.mainValve);
  }
}
