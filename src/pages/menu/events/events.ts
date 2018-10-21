import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, Platform, ModalController } from "ionic-angular";
import { HomePage2 } from "../../home.2/home2";
import { EventPage } from "../../event/event";
import { HandleLeakPage } from "../../handle-leak/handle-leak";
import { EditEventPage } from "../../edit-event/edit-event";
import { StatusEventService, Statuses, SystemStatusEvent, GlobalSystemSeverityTypes } from "../../../providers/StatusEvent-service";

@IonicPage()
@Component({
  selector: "page-events",
  templateUrl: "events.html"
})
export class EventsPage {
  private unregisterFunc: Function;
  private imageSource = "";

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
    this.navCtrl.setRoot(HomePage2);
  }

  ionViewDidLeave(): void {
    this.unregisterFunc();
  }

  itemTapped(event, e: SystemStatusEvent): void {
    this.navCtrl.push(EventPage, {
      eventID: e.idsystem_status
    });
  } 

  getActionButtonTitle (e: SystemStatusEvent): string {
    let curStatus = "";
    if (this.isLiveEvent(e))
      curStatus = "HANDLE_EVENT";
    else
      if (this.isOpenEvent(e))
        curStatus = "CLOSE_EVENT";
      else 
        curStatus = "VIEW_EVENT"
    return curStatus;
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
        eventID: e.idsystem_status
      });
    } else {
      this.openEditEventModal(e);
    }
  }

  openEditEventModal(e: SystemStatusEvent): void {
    this.navCtrl.push(EditEventPage, {
      eventID: e.idsystem_status
    });
    // let myModal = this.modalCtrl.create(EditEventPage, {
    //   eventID: e.idsystem_status
    // });
    // myModal.present();
  }
}
