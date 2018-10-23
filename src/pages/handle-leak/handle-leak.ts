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
import { LeakGuidance } from "../events/leakGuidance/leakGuidance";
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


  private setGauge () {

    var gaugeOptions = {
      chart: {
        //spacing: [0, 0, 0, 0]       ,
        spacingBottom: 0,
        spacingTop: 10,
        spacingLeft: 10,
        spacingRight: 10,

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

          [1, '#FF0000'] // red
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
    if (this.statusEventService.isLiveEventInSystem()!=false)
      if (! this.flowChart)
        this.flowChart = HighCharts.chart('gauge1', gaugeOptions);
    
    this.intervalRefreshGaugeTask = setInterval(() => {
      if (this.statusEventService.isLiveEventInSystem()!=false)
        if (this.flowChart && this.flowChart.series) 
          this.flowChart.series[0].points[0].update(this.flowService.getCurrentFlow());
    }, 1000);
  }

  ionViewWillEnter(): void {
    this.translate.get('MILLILITER_SHORT_R').subscribe(value => { this.MLright = value; });
    this.translate.get('MILLILITER_SHORT_L').subscribe(value => { this.MLleft = value; });
   
    this.setGauge();

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

  openLeakGuidance(): void {
    this.navCtrl.push(LeakGuidance, {
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
