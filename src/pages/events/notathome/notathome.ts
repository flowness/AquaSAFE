import { ViewChild, Component } from "@angular/core";
import { Navbar, AlertController, IonicPage, NavController, NavParams } from "ionic-angular";
import { NotALeakPage } from "../notaleak/notaleak";
import { Chart } from "chart.js";
import { ModelService } from "../../../providers/model-service";
import { asEvent } from "../../../lib/interfaces";

/**
 * Generated class for the NotathomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-notathome",
  templateUrl: "notathome.html",
})

export class NotathomePage {

  currentEvent: asEvent;
  step: number = 0;
  someOneHome: boolean = false;
  chart: Chart;
  private task: number;
  private endTappingValue: number;
  private maxNumOfPoints: number = 12;

  @ViewChild(Navbar) navBar: Navbar;
  @ViewChild("sourceOffCanvas") sourceOffCanvas;

  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, private modelService: ModelService) {
    this.endTappingValue = Math.random() < 0.5 ? 2 : 0;
    this.currentEvent = navParams.get("event");
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad NotathomePage");

    let chartDefine = {
      type: "line",
      data: {
        labels: ["0"],
        datasets: [{
          data: [19],
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

  ionViewDidLeave() : void {
    clearInterval(this.task);
  }

  private refreshData(): void {
    let currentFlow: number = this.modelService.getCurrentFlow();
    this.chart.data.datasets[0].data.push(currentFlow);
    this.chart.data.labels[this.chart.data.datasets[0].data.length] = this.chart.data.datasets[0].data.length.toString()

    if (this.chart.data.datasets[0].data.length > this.maxNumOfPoints) {
      this.chart.data.datasets[0].data = this.chart.data.datasets[0].data.slice(this.chart.data.datasets[0].data.length - this.maxNumOfPoints, this.chart.data.datasets[0].data.length);
    }
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

  shutValveOff() {
    let alert = this.alertCtrl.create({
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

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  PressYes() {
    this.someOneHome = true;
  }

  PressNo() {
    this.someOneHome = false;
    this.step++;
  }

  PressNoLeak() {
    this.navCtrl.pop();
    this.navCtrl.push(NotALeakPage, {
      event: this.currentEvent
    });

  }

  PressRealLeak() {
    this.step++;
    this.task = setInterval(() => {
      this.refreshData();
    }, 300);
  }
}

