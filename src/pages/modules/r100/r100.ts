import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { moduleData, module } from '../../../lib/interfaces';
import { ModelService } from '../../../providers/model-service';

/**
 * Generated class for the R100Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-r100',
  templateUrl: 'r100.html',
})
export class R100Page {
  module: module;
  data: moduleData;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public modelService: ModelService) {
    this.module = navParams.get('module');
    console.log("sn: " + this.module.sn);
    this.data = modelService.getModuleData(this.module.sn);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad R100Page');
  }

  public convertCToF(c: number): number {
    return Math.floor(c * 1.8 + 32)
  }
}
