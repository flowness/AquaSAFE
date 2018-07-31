import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, Platform } from "ionic-angular";
import { HomePage } from "../../home/home";

/**
 * Generated class for the EventsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-events",
  templateUrl: "events.html",
})

export class EventsPage {
  private items: Array<{title: string, timestamp: string, event: string, status: string}>;
  private unregisterFunc: Function;

  constructor(public navCtrl: NavController, public navParams: NavParams, platform: Platform) {
    this.items = [];
    let thisDate=new Date();
    let numItems = Math.ceil(Math.random() * 8) + 5;

    this. unregisterFunc =  platform.registerBackButtonAction(() => {
      this.backButton();
  });

  for (let i = 0; i < numItems; i++) {
      thisDate=new Date(thisDate.getTime() - (1000* (Math.ceil(Math.random() *  60 * 60 * 24) + 1)));
      this.items.push({
        title: "E-Mail",
        timestamp: thisDate.toISOString(),
        event: "bad",
        status: Math.random()>0.5?"close-circle":"checkmark-circle"
      });
    }
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad EventsPage");
  }

  private backButton(): void {
    this.navCtrl.setRoot(HomePage);
  }

  ionViewDidLeave() : void {
    this.unregisterFunc();
  }


}
