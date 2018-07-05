import { Component } from '@angular/core';
// import { ListPage } from '../list/list';
import { MP100Page } from '../mp100/mp100';
import { Fd100Page } from '../fd100/fd100';
import { Vs100Page } from '../vs100/vs100';
import { Bs100Page } from '../bs100/bs100';
import { R100Page } from '../r100/r100';


import { ModulePage } from '../module/module';
import { ActionPage } from '../action/action';
import { NotALeakPage } from '../notaleak/notaleak';
// import { NavController } from 'ionic-angular';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  data: any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    console.log('constructor');
    this.data = {};
    this.data.mainValve =  true;
    console.log('constructor finished');
  }

  ionViewWillEnter(){
    console.log('ionViewWillEnter');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad');
    let state = 'good';
    if (document.URL.indexOf("?") > 0) {
    	let splitURL = document.URL.split("?");
    	let splitParams = splitURL[1].split("&");
    	let i: any;
    	for (i in splitParams){
    		let singleURLParam = splitParams[i].split('=');
    		if (singleURLParam[0] == "state"){
    			state = singleURLParam[1].toLowerCase();
          console.log('state='+state);
    		}
      }
    }
    if (state ==='bad'){
      this.data.status = 2;
      this.prepareNotOkData();
      this.prepareWizardSteps();
    } else if (state==='warn'){
      this.prepareOkData();
      this.data.status = 3;
    } else {
      this.prepareOkData();
      this.data.status = 1;
    }
    console.log('this.data.status='+this.data.status);
  }

  prepareOkData(){
    let items = [];
    let numItems = Math.ceil(Math.random() * 8) + 1;
    let icons = ['build', 'water','aperture','cloud-outline','wifi'];
    let statuses = ['Battery', 'Check', 'Good'];
    let Device = ['MP100 Leak Sensor','FD100 Flood detector','VS100 Valve shutoff','BS100 Base Station','R100 RF repater']
    // init the MP100 unit
    items.push({
      title: Device[0],
      state: 'Good' ,
      icon: icons[0],
      type: 0,
      sn: this.getRandomSN()
    });
    let UnitCount=[0,4,4,1,2]; //FD,VS,BS,R

    for (let i = 2; i < numItems; i++) {
      let type=0;
      do
      {
        type=Math.floor(Math.random()*4)+1;
        if(UnitCount[type]>0)
        {
          UnitCount[type]--;
        }
        else
        {
          type=0
        }
      }
      while(type == 0)
      items.push({
        title: Device[type],
        state: statuses[Math.floor(Math.random() * statuses.length)],
        icon: icons[type],
        type: type,
        sn: this.getRandomSN()
      });
    }
    this.data.items = items;
  }

  prepareNotOkData(){
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
    if (item.type < 100) {
      if (item.type < 5 ) {
        this.navCtrl.push(Pages[item.type], {
          item: item
        });
      } else {
        this.navCtrl.push(ModulePage, {
          item: item
        });
      }
    } else {
      if (item.type === 100 ) {
        this.navCtrl.push(NotALeakPage, {
          item: item,
          alert: this.data.alert
        });
      } else {
        this.navCtrl.push(ActionPage, {
          item: item,
          alert: this.data.alert
        });
      }
    }
  }

  change() {
    console.log("toggle=" + this.data.mainValve);
  }
}
