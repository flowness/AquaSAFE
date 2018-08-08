import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, Platform } from "ionic-angular";
import { HomePage } from "../../home/home";
import { ModelService } from "../../../providers/model-service";
import { EventPage } from "../../event/event";

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
  private unregisterFunc: Function;

  constructor(public navCtrl: NavController, public navParams: NavParams, platform: Platform, public modelService: ModelService) {
    this.unregisterFunc = platform.registerBackButtonAction(() => {
      this.backButton();
    });
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad EventsPage");
  }

  private backButton(): void {
    this.navCtrl.setRoot(HomePage);
  }

  ionViewDidLeave(): void {
    this.unregisterFunc();
  }

  itemTapped(event, asEvent) {
    this.navCtrl.push(EventPage, {
      event: asEvent
    });
  }
}
