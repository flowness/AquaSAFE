import { Component } from '@angular/core';
// import { ListPage } from '../list/list';
import { MP100Page } from '../mp100/mp100';
import { ModulePage } from '../module/module';
import { ActionPage } from '../action/action';
// import { NavController } from 'ionic-angular';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  data = {
    mainValve: true
  };
  status: number;
  selectedItem: any;
  icons: string[];
  statuses: string[];
  items: Array<{title: string, state: string, icon: string, type: number}>;
  wizardStep1: Array<{title: string, action: string, icon: string, type: number}>;
  // numItems: number;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
    this.status = Math.ceil(Math.random() * 100);

    // Let's populate this page with some filler content for funzies
    this.items = [];
    let numItems = Math.ceil(Math.random() * 15) + 1;
    this.icons = ['wifi', 'bluetooth'];
    this.statuses = ['Battery', 'Check', 'Good'];
    for (let i = 1; i < numItems; i++) {
      this.items.push({
        title: i == 1 ? 'MP100 Leak Sensor': 'Sensor ' + i,
        // note: i == 1 ? 'Good' : 'This is item #' + i,
        state: i == 1 ? 'Good' : this.statuses[Math.floor(Math.random() * this.statuses.length)],
        icon: i == 1 ? 'build' : this.icons[Math.floor(Math.random() * this.icons.length)],
        type: i == 1 ? 0 : 1
      });
    }

    // Let's populate this page with some filler content for wizard
    this.wizardStep1 = [];
    let wizIcons = ['wifi', 'bluetooth'];
    let wizActions = ['Respond', 'Quick Help','Quick Help', 'Help!'];
    let wizTitles = ['Not A Leak', 'I don\'t see a leak', 'I\'m not at home', 'I see a leak!'];
    for (let i = 0; i < wizTitles.length; i++) {
      this.wizardStep1.push({
        icon: wizIcons[Math.floor(Math.random() * wizIcons.length)],
        title: wizTitles[i],
        action: wizActions[i],
        type: 100+i
      });
    }
  }

  itemTapped(event, item) {
    console.log("item type = " + item.type);
    if (item.type < 100) {
      if (item.type === 0 ) {
        this.navCtrl.push(MP100Page, {
          item: item
        });
      } else {
        this.navCtrl.push(ModulePage, {
          item: item
        });
      }
    } else {
      this.navCtrl.push(ActionPage, {
        item: item
      });
    }
  }

  change() {
    console.log("toggle=" + this.data.mainValve);
  }
}
