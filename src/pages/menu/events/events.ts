import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, Platform, ModalController } from "ionic-angular";
import { HomePage } from "../../home/home";
import { EventPage } from "../../event/event";
import { HandleLeakPage } from "../../handle-leak/handle-leak";
import { EditEventPage } from "../../edit-event/edit-event";
import { StatusEventService, Statuses, SystemStatusEvent } from "../../../providers/StatusEvent-service";

@IonicPage()
@Component({
  selector: "page-events",
  templateUrl: "events.html"
})
export class EventsPage {
  private unregisterFunc: Function;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    platform: Platform,
    //public modelService: ModelService,
    private statusEventService: StatusEventService,
    public modalCtrl: ModalController
  ) {
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

  itemTapped(event, e: SystemStatusEvent): void {
    this.navCtrl.push(EventPage, {
      event: e
    });
  } 
  
  isLiveEvent(e: SystemStatusEvent): boolean {
    return e.status == Statuses.LIVE;
  }

  isOpenEvent(e: SystemStatusEvent): boolean {
    return e.status != Statuses.CLOSED;
  }

  handleAsEvent(e: SystemStatusEvent): void {
    console.log("item type = " + e.status);
    if (e.status == Statuses.LIVE) {
      this.navCtrl.push(HandleLeakPage, {
        event: e
      });
    } else {
      this.openEditEventModal(e);
    }
  }

  openEditEventModal(e: SystemStatusEvent): void {
    let myModal = this.modalCtrl.create(EditEventPage, {
      event: e
    });
    myModal.present();
  }
}
