import { Component } from '@angular/core';
import { ListPage } from '../list/list';
// import { NavController } from 'ionic-angular';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  status: number;
  selectedItem: any;
  icons: string[];
  statuses: string[];
  items: Array<{title: string, state: string, icon: string}>;
  // numItems: number;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');

    // Let's populate this page with some filler content for funzies
    this.icons = ['wifi', 'bluetooth'];
    this.statuses = ['Battery', 'Check', 'Good'];

    this.items = [];
    this.status = Math.ceil(Math.random() * 100);
    let numItems = Math.ceil(Math.random() * 15) + 1;

    for (let i = 1; i < numItems; i++) {
      this.items.push({
        title: i == 1 ? 'MP100 Leak Sensor': 'Sensor ' + i,
        // note: i == 1 ? 'Good' : 'This is item #' + i,
        state: i == 1 ? 'Good' : this.statuses[Math.floor(Math.random() * this.statuses.length)],
        icon: i == 1 ? 'build' : this.icons[Math.floor(Math.random() * this.icons.length)]
      });
    }
  }

  itemTapped(event, item) {
    this.navCtrl.push(ListPage, {
      item: item
    });
  }
}
