import { Component } from '@angular/core';
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
import { ModelService } from '../../app/model-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, private modelService: ModelService) {
    console.log('constructor');
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad');
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
          alert: this.modelService.getModel().alert
        });
        break;
      case 101:
        this.navCtrl.push(CantseeLeakPage, {
          alert: this.modelService.getModel().alert
        });
        break;
      case 102:
        this.navCtrl.push(NotathomePage, {
          alert: this.modelService.getModel().alert
        });
        break;
      case 103:
        this.navCtrl.push(IsALeakPage, {
          alert: this.modelService.getModel().alert
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
              this.modelService.updateModel(module, 'valve');
            }
          }
        ]
      });
      alert.present();
    }
  }
}
