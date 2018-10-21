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
import { FlowService } from "../../providers/Flow-service";

import { TranslateService } from '@ngx-translate/core';

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
  private flowChart: HighCharts.chart;
  private intervalRefreshGaugeTask: number;
  private MLright = "Default-MLright";
  private MLleft = "Default-MLleft";

  constructor(private camera: Camera, 
              public navCtrl: NavController, 
              public navParams: NavParams,
              private flowService: FlowService,
              public translate: TranslateService,
              private statusEventService: StatusEventService,
              private translate: TranslateService,
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

  ionViewWillEnter(): void {
    this.translate.get('MILLILITER_SHORT_R').subscribe(value => { this.MLright = value; });
    this.translate.get('MILLILITER_SHORT_L').subscribe(value => { this.MLleft = value; });

    var gaugeOptions = {
      chart: {
        spacing: [0, 0, 0, 0],
        type: 'solidgauge',
        height: '40%',
        backgroundColor: null
      },
      title: null,
      pane: {
        center: ['50%', '50%'],
        size: '90%',
        startAngle: -90,
        endAngle: 90,
        background: {
          backgroundColor: (HighCharts.theme && HighCharts.theme.background2) || '#EEE',
          innerRadius: '60%',
          outerRadius: '100%',
          shape: 'arc'
        }
      },
      tooltip: {
        enabled: false
      },
      // the value axis
      yAxis: {
        min: 0,
        max: 600,
        title: {
          text: 'Flow',
          y: -80
        },
        stops: [
          [0.1, '#55BF3B'], // green
          [0.5, '#DDDF0D'], // yellow
          [0.9, '#DF5353'] // red
        ],
        lineWidth: 0,
        minorTickInterval: null,
        tickAmount: 2,
        labels: {
          y: 16,
          enabled: false
        }
      },
      credits: {
        enabled: false
      },
      series: [{
        name: 'Consumption',
        data: [this.flowService.getCurrentFlow()],
        dataLabels: {
          format: '<div style="text-align:center"><span style="font-size:20px;color:black">' + this.MLleft + ' {y} ' + this.MLright + '</span><span></span></div>'
        }
      }],
      plotOptions: {
        solidgauge: {
          dataLabels: {
            y: 5,
            borderWidth: 0,
            useHTML: true
          }
        }
      }
    };
    this.flowChart = HighCharts.chart('gauge', gaugeOptions);
    this.intervalRefreshGaugeTask = setInterval(() => {
      this.flowChart.series[0].points[0].update(this.flowService.getCurrentFlow());
    }, 1000);

  }


  notAtHome(): void {
    let notAtHomeTitle, notAtHomeSubTitle, notAtHomeOK = "";
    this.translate.get('NOT_AT_HOME_TITLE').subscribe(value => {notAtHomeTitle = value;});
    this.translate.get('NOT_AT_HOME_SUB_TITLE').subscribe(value => {notAtHomeSubTitle= value;});
    this.translate.get('NOT_AT_HOME_OK').subscribe(value => {notAtHomeOK = value;});

    let alert = this.alertCtrl.create({
      title: notAtHomeTitle,
      subTitle: notAtHomeSubTitle,
      buttons: [notAtHomeOK]
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

  ionViewDidLeave(): void {
    clearInterval(this.intervalRefreshGaugeTask);
  }

}
