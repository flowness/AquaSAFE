import { Component } from "@angular/core";
import { NavController, NavParams, AlertController, LoadingController } from "ionic-angular";

import {
  trigger,
  state,
  style,
  animate,
  transition
} from "@angular/animations";
import { StatusEventService, Statuses, SystemStatusEvent } from "../../../providers/StatusEvent-service";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: "page-leak-guidance",
  templateUrl: "leakGuidance.html",
})

export class LeakGuidance {
  eventID: number;
  theEvent: SystemStatusEvent;

  constructor(public alertCtrl: AlertController, 
              public navCtrl: NavController, 
              public navParams: NavParams, 
              private statusEventService: StatusEventService,
              private translate: TranslateService,
              public loadingCtrl: LoadingController) {
    this.eventID = navParams.get("eventID");
    this.theEvent = statusEventService.getEventList()[statusEventService.getSystemStatusEventIndexByID(this.eventID)];
                    
  }

  private notAtHome(): void {
    let notAtHomeTitle, notAtHomeSubTitle, notAtHomeOK = "";
    this.translate.get('NOT_AT_HOME_TITLE').subscribe(value => {notAtHomeTitle = value;});
    this.translate.get('NOT_AT_HOME_SUB_TITLE').subscribe(value => {notAtHomeSubTitle= value;});
    this.translate.get('NOT_AT_HOME_OK').subscribe(value => {notAtHomeOK = value;});

    let alert = this.alertCtrl.create({
      title: notAtHomeTitle,
      subTitle: notAtHomeSubTitle,
      buttons: [notAtHomeOK]
    });
    alert.present();
  }


}
