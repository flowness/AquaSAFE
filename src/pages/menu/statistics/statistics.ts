import { Component } from "@angular/core";
import { IonicPage, NavController, Platform } from "ionic-angular";
import { HomePage } from "../../home/home";

/**
 * Generated class for the MenuStatisticsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-statistics",
  templateUrl: "statistics.html",
})
export class StatisticsPage {
  private unregisterFunc: Function;

  constructor(public navCtrl: NavController, platform: Platform) {
    this.unregisterFunc = platform.registerBackButtonAction(() => {
      this.backButton();
    });
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad StatisticsPage");
  }

  private backButton(): void {
    this.navCtrl.setRoot(HomePage);
  }

  ionViewDidLeave(): void {
    this.unregisterFunc();
  }

}
