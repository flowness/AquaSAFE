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
  selector: "page-notaleak",
  templateUrl: "notaleak.html",
  animations: [
    trigger("elementState0", [
      state("opaque", style({
        opacity: 1
      })),
      state("transparent", style({
        opacity: 0
      })),
      transition("opaque => transparent", animate("1000ms ease-in")),
      transition("transparent => opaque", animate("1000ms ease-in"))
    ]),
    trigger("elementState1", [
      state("opaque", style({
        opacity: 1
      })),
      state("transparent", style({
        opacity: 0
      })),
      transition("opaque => transparent", animate("1000ms ease-in")),
      transition("transparent => opaque", animate("1000ms ease-in"))
    ]),
    trigger("elementState2", [
      state("opaque", style({
        opacity: 1
      })),
      state("transparent", style({
        opacity: 0
      })),
      transition("opaque => transparent", animate("1000ms ease-in")),
      transition("transparent => opaque", animate("1000ms ease-in"))
    ]),
    trigger("elementState3", [
      state("opaque", style({
        opacity: 1
      })),
      state("transparent", style({
        opacity: 0
      })),
      transition("opaque => transparent", animate("1000ms ease-in")),
      transition("transparent => opaque", animate("1000ms ease-in"))
    ]),
    trigger("elementState4", [
      state("opaque", style({
        opacity: 1
      })),
      state("transparent", style({
        opacity: 0
      })),
      transition("opaque => transparent", animate("1000ms ease-in")),
      transition("transparent => opaque", animate("1000ms ease-in"))
    ]),
    trigger("elementState5", [
      state("opaque", style({
        opacity: 1
      })),
      state("transparent", style({
        opacity: 0
      })),
      transition("opaque => transparent", animate("1000ms ease-in")),
      transition("transparent => opaque", animate("1000ms ease-in"))
    ]),
    trigger("elementState6", [
      state("opaque", style({
        opacity: 1
      })),
      state("transparent", style({
        opacity: 0
      })),
      transition("opaque => transparent", animate("1000ms ease-in")),
      transition("transparent => opaque", animate("1000ms ease-in"))
    ])

  ]
})

export class NotALeakPage {
  eventID: number;
  theEvent: SystemStatusEvent;
  //currentEvent: SystemStatusEvent;
  state0 = "opaque";
  state1 = "opaque";
  state2 = "opaque";
  state3 = "opaque";
  state4 = "opaque";
  state5 = "opaque";
  state6 = "opaque";
  numButtons = 7;

  constructor(public alertCtrl: AlertController, 
              public navCtrl: NavController, 
              public navParams: NavParams, 
              private statusEventService: StatusEventService,
              private translate: TranslateService,
              public loadingCtrl: LoadingController) {
    this.eventID = navParams.get("eventID");
    this.theEvent = statusEventService.getEventList()[statusEventService.getSystemStatusEventIndexByID(this.eventID)];
                        
//    this.currentEvent = navParams.get("event");
//    console.log("navParams = " + this.currentEvent.timestamp);
  }

  doConfirm(waterUsage, i) {
    for (let index = 0; index < this.numButtons; index++) {
      if (i != index) {
        this["state" + index] = this["state" + index] === "transparent" ? "opaque" : "transparent";
      }
    }

    let notALeakConfirm, notALeakConfirmMessage, waterUsageSTR, confirmNo, confirmYes, notALeakCloseEvent = "";
    
    this.translate.get('NOT_A_LEAK_CONFIRM').subscribe(value => {notALeakConfirm = value;});
    this.translate.get('CONFIRM_NO').subscribe(value => {confirmNo = value;});
    this.translate.get('CONFIRM_YES').subscribe(value => {confirmYes = value;});
    this.translate.get('NOT_A_LEAK_CONFIRM_MESSAGE').subscribe(value => {notALeakConfirmMessage = value;});
    this.translate.get(waterUsage).subscribe(value => {waterUsageSTR = value;});
    this.translate.get("NOT_A_LEAK_CLOSE_EVENT").subscribe(value => {notALeakCloseEvent = value;});

    
    notALeakConfirmMessage += waterUsageSTR + "?";

    let alert = this.alertCtrl.create({
      title: notALeakConfirm,
      message: notALeakConfirmMessage,
      buttons: [
        {
          text: confirmNo,
          handler: () => {
            console.log("No clicked");
          }
        },
        {
          text: confirmYes,
          handler: () => {
            console.log("Yes clicked");
            this.statusEventService.closeStatusEvent (this.eventID,notALeakCloseEvent + waterUsageSTR);
            //this.modelService.updateEventNotALeak(this.currentEvent);
            this.navCtrl.pop();
            this.navCtrl.pop();
          }
        }
      ]
    });

    alert.present();
    
  }

  noAnswer() {
    let alert = this.alertCtrl.create({
      message: "You may always add your input later in the Events Screen",
      buttons: [
        {
          text: "OK",
          handler: () => {
            this.statusEventService
            //this.modelService.updateModelNotALeak();
            this.navCtrl.pop();
          }
        }
      ]
    });

    alert.present();
  }


}
