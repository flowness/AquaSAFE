import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  items: Array<{title: string, input: string, icon: string,value:any}>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param

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

    }
  
}
