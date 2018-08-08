import { Component } from "@angular/core";
import { NavController, NavParams, AlertController, LoadingController } from "ionic-angular";

import {
  trigger,
  state,
  style,
  animate,
  transition
} from "@angular/animations";
import { ModelService } from "../../../providers/model-service";

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
  currentEvent: asEvent;
  state0 = "opaque";
  state1 = "opaque";
  state2 = "opaque";
  state3 = "opaque";
  state4 = "opaque";
  state5 = "opaque";
  state6 = "opaque";
  numButtons = 7;

  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, private modelService:ModelService, public loadingCtrl: LoadingController) {
    this.currentEvent = navParams.get("event");
    console.log("navParams = " + this.currentEvent.timestamp);
  }

  doConfirm(waterUsage, i) {
    for (let index = 0; index < this.numButtons; index++) {
      if (i != index) {
        this["state" + index] = this["state" + index] === "transparent" ? "opaque" : "transparent";
      }
    }
    let alert = this.alertCtrl.create({
      title: "Confirmation",
      message: "Did the water usage detection done by the " + waterUsage + "?",
      buttons: [
        {
          text: "No",
          handler: () => {
            console.log("No clicked");
          }
        },
        {
          text: "Yes",
          handler: () => {
            console.log("Yes clicked");
            this.modelService.updateModelSetAllGood();
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
            this.modelService.updateModelSetAllGood();
            this.navCtrl.pop();
          }
        }
      ]
    });

    alert.present();
  }


}
