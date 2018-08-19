import { Component } from "@angular/core";
import { NavController, NavParams, LoadingController, AlertController, Alert } from "ionic-angular";

import { MP100Page } from "../modules/mp100/mp100";
import { Fd100Page } from "../modules/fd100/fd100";
import { Vs100Page } from "../modules/vs100/vs100";
import { Bs100Page } from "../modules/bs100/bs100";
import { R100Page } from "../modules/r100/r100";

import { CantseeLeakPage } from "../events/cantseeleak/cantseeleak";
import { IsALeakPage } from "../events/isaleak/isaleak";
import { NotALeakPage } from "../events/notaleak/notaleak";
import { NotathomePage } from "../events/notathome/notathome";
import { ModelService } from "../../providers/model-service";
import { Page } from "ionic-angular/umd/navigation/nav-util";
import { DataFinder } from "../../providers/data-finder";
import { module } from "../../lib/interfaces";

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  private pages: Page[] = [MP100Page, Fd100Page, Vs100Page, Bs100Page, R100Page];

  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, private modelService: ModelService, public dataFinder: DataFinder) {
    console.log("constructor home");
  }

  ionViewWillEnter(): void {
    console.log("ionViewWillEnter home");
  }

  ionViewDidLoad(): void {
    console.log("ionViewDidLoad home");
  }

  moduleTapped(event: any, module: any): void {
    console.log("module type = " + module.type);
    this.navCtrl.push(this.pages[module.type], {
      module: module
    });
  }

  eventItemTapped(event: any, eventType: number): void {
    console.log("item type = " + eventType);
    this.navCtrl.push(this.getEventPage(eventType), {
      event: this.modelService.getLatestOpenEvent()
    });
  }

  getEventPage(eventType: number): Page {
    switch (eventType) {
      case 100:
        return NotALeakPage;
      case 101:
        return CantseeLeakPage;
      case 102:
        return NotathomePage;
      case 103:
        return IsALeakPage;
    }
  }

  handleToggleValveChange(checked: boolean, module: module): void {
    console.log("toggle1=" + module.valve + " checked=" + checked);
    if (checked === module.valve) {
      let alert: Alert = this.alertCtrl.create({
        title: "Confirmation",
        message: "Are you sure you want to " + (module.valve ? "open" : "close") + " the main valve?",
        buttons: [
          {
            text: "No",
            handler: () => {
              console.log("No clicked");
              module.valve = !module.valve;
            }
          },
          {
            text: "Yes",
            handler: () => {
              console.log("Yes clicked. checked = " + checked);
              module.valve = checked;
              this.modelService.toggleValve(module.sn, module.valve);
            }
          }
        ]
      });
      alert.present();
    }
  }
}
