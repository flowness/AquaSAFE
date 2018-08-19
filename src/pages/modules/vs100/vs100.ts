import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { module, moduleData } from '../../../lib/interfaces';
import { ModelService } from '../../../providers/model-service';

/**
 * Generated class for the Vs100Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-vs100',
  templateUrl: 'vs100.html',
})
export class Vs100Page {
  module: module;
  data: moduleData;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public modelService: ModelService) {
    this.module = navParams.get('module');
    console.log("sn: " + this.module.sn);
    this.data = modelService.getModuleData(this.module.sn);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Vs100Page');
  }

  public convertCToF(c: number): number {
    return Math.floor(c * 1.8 + 32)
  }
}
