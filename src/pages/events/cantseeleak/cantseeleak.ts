import { ViewChild, Component } from "@angular/core";
import { Navbar, AlertController, IonicPage, NavController, NavParams, Alert } from "ionic-angular";
import { Chart } from "chart.js";
import { ModelService } from "../../../providers/model-service";

/**
 * Generated class for the CantseeLeakPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-cantseeleak",
  templateUrl: "cantseeleak.html",
})
export class CantseeLeakPage {
  currentEvent: asEvent;
  step: number = 0;
  private endTappingValue: number;
  private chart: Chart;
  private task: number;
  private maxNumOfPoints: number = 12;

  @ViewChild(Navbar) navBar: Navbar;

  @ViewChild("sourceOffCanvas") sourceOffCanvas;

  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, private modelService: ModelService) {
    this.currentEvent = navParams.get("event");
    this.endTappingValue = Math.floor(Math.random() * 31) % 2 == 0 ? 2 : 0;
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad CantseeLeakPage");
    let chartDefine: any = {
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

  ionViewDidLeave() : void {
    clearInterval(this.task);
  }

  private refreshData(): void {
    let currentFlow: number = this.modelService.getCurrentFlow();
    console.log("current flow = " + currentFlow);
    this.chart.data.datasets[0].data.push(currentFlow);
    this.chart.data.labels[this.chart.data.datasets[0].data.length] = this.chart.data.datasets[0].data.length.toString()

    if (this.chart.data.datasets[0].data.length > this.maxNumOfPoints) {
      this.chart.data.datasets[0].data = this.chart.data.datasets[0].data.slice(this.chart.data.datasets[0].data.length - this.maxNumOfPoints, this.chart.data.datasets[0].data.length);
    }
    console.dir(this.chart.data.datasets[0].data);
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

  text(): string {
    return this.modelService.getCurrentFlow() === 0 ? "Seems like the water flow stopped:" : "If there is still some flow suggest to:";
  }

  nextStep(): void {
    this.step++;
  }

  prevStep(): void {
    this.step--;
  }

  nextButtonString(step: number): string {
    return (step === 0) ? "All closed" : "Next";
  }

  shutOffValve(): void {
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
}

