import { Component, ViewChild } from "@angular/core";
import { IonicPage, NavController, NavParams, Alert, AlertController } from "ionic-angular";
import { ModelService } from "../../providers/model-service";
import { NotALeakPage } from "../events/notaleak/notaleak";
import { Page } from "ionic-angular/umd/navigation/nav-util";
import { CantseeLeakPage } from "../events/cantseeleak/cantseeleak";
import { NotathomePage } from "../events/notathome/notathome";
import { IsALeakPage } from "../events/isaleak/isaleak";
import * as HighCharts from "highcharts";
import * as HighchartsMore from "highcharts/highcharts-more";
import * as SolidGauge from "highcharts/modules/solid-gauge";
HighchartsMore(HighCharts);
SolidGauge(HighCharts);

/**
 * Generated class for the HandleLeakPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-handle-leak",
  templateUrl: "handle-leak.html",
})

export class HandleLeakPage {

  @ViewChild("sourceOffCanvas") sourceOffCanvas;
  private chart: any;
  private task: number;
  private endTappingValue: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modelService: ModelService, private alertCtrl: AlertController) {
    this.endTappingValue = Math.random() < 0.5 ? 2 : 0;
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad HandleLeakPage");
    var gaugeOptions = {
      chart: {
        spacingTop: 10,
        spacingBottom: 0,
        marginTop: 0,
        marginBottom: 0,
        type: 'solidgauge'
      },
      title: null,
      pane: {
        center: ['50%', '50%'],
        size: '90%',
        startAngle: -90,
        endAngle: 70,
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
        stops: [
          [0.1, '#55BF3B'], // green
          [0.5, '#DDDF0D'], // yellow
          [0.9, '#DF5353'] // red
        ],
        lineWidth: 0,
        minorTickInterval: null,
        tickAmount: 2,
        title: {
          y: -80
        },
        labels: {
          y: 16
        }
      },
    
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
    
    this.chart = HighCharts.chart('container', HighCharts.merge(gaugeOptions, {
      yAxis: {
        min: 0,
        max: 20,
        title: {
          text: 'Flow'
        }
      },
      credits: {
        enabled: false
      },
      series: [{
        name: 'Consumption',
        data: [this.modelService.getCurrentFlow()],
        dataLabels: {
          format: '<div style="text-align:center"><span style="font-size:25px;color:' +
            ((HighCharts.theme && HighCharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
               '<span style="font-size:12px;color:silver">Liter/Hour</span></div>'
        },
        tooltip: {
          valueSuffix: ' l/h'
        }
      }]
    
    }));

    this.task = setInterval(() => {
      this.refreshDataGauge();
    }, 1500);
  }

  refreshDataGauge(): void{
    let     point = this.chart.series[0].points[0];
    point.update(this.modelService.getCurrentFlow());

  }

  updateCurrentValue(): void {
    console.log("***tap");
    let currentData: number = this.modelService.getCurrentFlow();
    if (currentData > this.endTappingValue) {
      let changeData = Math.floor(Math.random() * 8) + 2;
      this.modelService.setCurrentFlow(Math.max(currentData - changeData, this.endTappingValue));
    }
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

  ionViewDidLeave(): void {
    clearInterval(this.task);
  }

  shutValve(): void {
    let alert: Alert = this.alertCtrl.create({
      title: "Confirmation",
      message: "Are you sure you want to close the main valve?",
      buttons: [
        {
          text: "No",
          handler: () => {
            console.log("No clicked");
          }
        },
        {
          text: "Yes",
          handler: () => {
            console.log("Yes clicked.");
            this.modelService.toggleAllValves(false);
          }
        }
      ]
    });
    alert.present();
  }

  notAtHome(): void {
    let alert = this.alertCtrl.create({
      title: 'Not at Home?',
      subTitle: 'get a life!',
      buttons: ['Ok']
    });
    alert.present();
  }

  notALeak(): void{
    this.navCtrl.push(NotALeakPage, {
      event: this.modelService.getLatestOpenEvent()
    });
  }
}
