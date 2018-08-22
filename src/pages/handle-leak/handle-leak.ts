import { Component, ViewChild } from "@angular/core";
import { IonicPage, NavController, NavParams, Alert, AlertController } from "ionic-angular";
import { ModelService } from "../../providers/model-service";
import { NotALeakPage } from "../events/notaleak/notaleak";
import { Page } from "ionic-angular/umd/navigation/nav-util";
import { CantseeLeakPage } from "../events/cantseeleak/cantseeleak";
import { NotathomePage } from "../events/notathome/notathome";
import { IsALeakPage } from "../events/isaleak/isaleak";
import { Chart } from "chart.js";


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
  private chart: Chart;
  private task: number;
  private maxNumOfPoints: number = 12;
  private endTappingValue: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modelService: ModelService, private alertCtrl: AlertController) {
    this.endTappingValue = Math.random() < 0.5 ? 2 : 0;
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad HandleLeakPage");
    let chartDefine = {
      type: "line",
      data: {
        labels: ["0"],
        datasets: [{
          data: [this.modelService.getCurrentFlow()],
          borderWidth: 1,
          backgroundColor: "#0062ff",
        }]
      },
      options: {
        elements: {
          point: {
            radius: 0
          }
        },
        responsive: false,
        legend: {
          display: false,
        },
        scales: {
          yAxes: [{
            ticks: {
              display: false,
              min: 0,
              max: 20
            }
          }],
          xAxes: [{
            ticks: {
              display: false,
            },
            gridLines: {
              display: false
            }
          }]
        }
      }
    }

    this.chart = new Chart(this.sourceOffCanvas.nativeElement, chartDefine);

    this.task = setInterval(() => {
      this.refreshData();
    }, 1500);
  }

  private refreshData(): void {
    let currentFlow: number = this.modelService.getCurrentFlow();
    console.log("current flow = " + currentFlow);
    this.chart.data.datasets[0].data.push(currentFlow);
    this.chart.data.labels[this.chart.data.datasets[0].data.length] = this.chart.data.datasets[0].data.length.toString()

    if (this.chart.data.datasets[0].data.length > this.maxNumOfPoints) {
      this.chart.data.datasets[0].data = this.chart.data.datasets[0].data.slice(this.chart.data.datasets[0].data.length - this.maxNumOfPoints, this.chart.data.datasets[0].data.length);
    }
    // console.dir(this.chart.data.datasets[0].data);
    this.chart.update(0);
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
}
