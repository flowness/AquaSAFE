import { Component, ViewChild } from "@angular/core";
import { IonicPage, NavController, NavParams, Alert, AlertController } from "ionic-angular";
import { NotALeakPage } from "../events/notaleak/notaleak";
import { Page } from "ionic-angular/umd/navigation/nav-util";
import { CantseeLeakPage } from "../events/cantseeleak/cantseeleak";
import { NotathomePage } from "../events/notathome/notathome";
import { IsALeakPage } from "../events/isaleak/isaleak";
import * as HighCharts from "highcharts";
import * as HighchartsMore from "highcharts/highcharts-more";
import * as SolidGauge from "highcharts/modules/solid-gauge";
import { PlumbersPage } from "../plumbers/plumbers";
import { CameraOptions, Camera } from "@ionic-native/camera";
import { StatusEventService, Statuses, SystemStatusEvent } from "../../providers/StatusEvent-service";

HighchartsMore(HighCharts);
SolidGauge(HighCharts);

@IonicPage()
@Component({
  selector: "page-handle-leak",
  templateUrl: "handle-leak.html",
})

export class HandleLeakPage {

  @ViewChild("sourceOffCanvas") sourceOffCanvas;
  public base64Image: string;
  eventID: number;
  theEvent: SystemStatusEvent;

  constructor(private camera: Camera, 
              public navCtrl: NavController, 
              public navParams: NavParams, 
              private statusEventService: StatusEventService,
              private alertCtrl: AlertController) {
    this.eventID = navParams.get("eventID");
    this.theEvent = statusEventService.getEventList()[statusEventService.getSystemStatusEventIndexByID(this.eventID)];
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad HandleLeakPage");
  }

  eventItemTapped(event: any, eventType: number): void {
    console.log("item type = " + eventType);
    this.navCtrl.push(this.getEventPage(eventType), {
      eventID: this.eventID
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


  notAtHome(): void {
    let alert = this.alertCtrl.create({
      title: 'Not at Home?',
      subTitle: 'Please contact person that can assist controlling the event!',
      buttons: ['Ok']
    });
    alert.present();
  }

  notALeak(): void {
    this.navCtrl.push(NotALeakPage, {
      eventID: this.eventID
    });
  }

  openPlumbers(): void {
    this.navCtrl.push(PlumbersPage, {
      eventID: this.eventID
    });
  }

  takePicture(): void {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      this.base64Image = "data:image/jpeg;base64," + imageData;
    }, (err) => {
      // Handle error
    });

    /*    this.camera.getPicture(this.onSuccess, this.onFail, options);*/

  }
}
