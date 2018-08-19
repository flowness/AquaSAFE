import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ModelService } from '../../../providers/model-service';
import { module, moduleData } from '../../../lib/interfaces';

@Component({
  selector: 'page-mp100',
  templateUrl: 'mp100.html'
})

export class MP100Page {
  module: module;
  data: moduleData;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modelService: ModelService) {
    this.module = navParams.get('module');
    console.log("sn: " + this.module.sn);
    this.data = modelService.getModuleData(this.module.sn);
  }

  public convertCToF(c: number): number {
    return Math.floor(c * 1.8 + 32)
  }
}
