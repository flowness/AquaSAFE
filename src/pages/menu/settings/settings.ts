import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class settingsPage {
  items: Array<{title: string, input: string, icon: string,value:any}>;
  data: any;

  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, private storage: Storage) {
    // If we navigated to this page, we will have an item available as a nav param
    this.storage.get('model').then((val) => { if (val != null) { console.log('val.status = ' + val.status); this.data = val;}});
    console.log('this.data = ' + this.data);
    // console.log('this.data.status = ' + this.data.status);

    this.items = [];
    this.items.push({
      title: 'E-Mail',
      input: 'text',
      icon: 'mail',
      value: ''
    });
    this.items.push({
      title: 'SMS',
      input: 'text',
      icon: 'call',
      value: ''
    });
    this.items.push({
      title: 'Freez Alert',
      input: 'toggle',
      icon: 'warning',
      value: false
    });
    this.items.push({
      title: 'Irregularity Alert',
      input: 'toggle',
      icon: 'warning',
      value: false
    });
    this.items.push({
      title: 'Leakage Alert',
      input: 'toggle',
      icon: 'warning',
      value: false
    });
    this.items.push({
      title: 'Zero-Flow Hours Alert:',
      input: 'toggle',
      icon: 'warning',
      value: false
    });

    this.items.push({
      title: 'Liters/Gallons',
      input: 'toggle',
      icon: 'water',
      value: false
    });
    console.log('this.data2 = ' + this.data);

    }

    handleToggleChange(evt, item) {
      console.log('this.data3 = ' + this.data);
      if (item.title === 'Leakage Alert') {
        console.log("setting leakage alert to " + item.value);
      }
    }
}
