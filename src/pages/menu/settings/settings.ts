import { Component } from "@angular/core";
import { NavController, NavParams, AlertController, LoadingController, Platform } from "ionic-angular";
import { ModelService } from "../../../providers/model-service";
import { HomePage } from "../../home/home";

@Component({
  selector: "page-settings",
  templateUrl: "settings.html"
})
export class SettingsPage {
  items: Array<{ title: string, input: string, icon: string, value: any }>;
  statuses = ["Low Battery", "Tamper", "Communication", "OK"];
  unregisterFunc: Function;

  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, private modelService: ModelService, platform: Platform) {
    this.unregisterFunc = platform.registerBackButtonAction(() => {
      this.backButton();
    });

    this.items = [];

    this.items.push({
      title: "E-Mail",
      input: "text",
      icon: "mail",
      value: ""
    });
    this.items.push({
      title: "SMS",
      input: "text",
      icon: "call",
      value: ""
    });
    this.items.push({
      title: "Freeze Alert",
      input: "toggle",
      icon: "warning",
      value: false
    });
    this.items.push({
      title: "Irregularity Alert",
      input: "toggle",
      icon: "warning",
      value: this.modelService.getSettings().irregularityAlert
    });
    this.items.push({
      title: "Leakage Alert",
      input: "toggle",
      icon: "warning",
      value: this.modelService.getSettings().leakageAlert
    });
    this.items.push({
      title: "Zero-Flow Hours Alert:",
      input: "toggle",
      icon: "warning",
      value: false
    });

    this.items.push({
      title: "Liters/Gallons",
      input: "toggle",
      icon: "water",
      value: false
    });
  }

  private backButton(): void {
    this.navCtrl.setRoot(HomePage);
  }

  ionViewDidLeave(): void {
    this.unregisterFunc();
  }

  handleToggleChange(evt, item) {
    if (item.title === "Leakage Alert" || item.title === "Irregularity Alert") {
      console.log("setting leakage alert to " + item.value);
      this.modelService.updateSettings(item.title, item.value);
    }
  }
}
