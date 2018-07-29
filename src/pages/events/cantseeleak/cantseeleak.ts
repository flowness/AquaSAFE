import { ViewChild, Component } from "@angular/core";
import { Navbar, AlertController, IonicPage, NavController, NavParams, Alert } from "ionic-angular";
import { Chart } from "chart.js";
import { ModelService } from "../../../lib/model-service";

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
  currentSiteAlert: any;
  state: number = 0;
  private endTappingValue: number;
  private dataIndex: number = 0;
  private chart: Chart;
  private task: number;
  private valveOffChart: Chart;
  private taskValve: number;
  valveStatus: number = 0;
  private maxNumOfPoints: number = 12;

  @ViewChild(Navbar) navBar: Navbar;

  @ViewChild("sourceOffCanvas") sourceOffCanvas;

  @ViewChild("valveOffCanvas") valveOffCanvas;


  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, private modelService: ModelService) {
    this.currentSiteAlert = navParams.get("alert");
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

    this.valveOffChart = new Chart(this.valveOffCanvas.nativeElement, chartDefine);

    this.chart = new Chart(this.sourceOffCanvas.nativeElement, chartDefine);

    this.task = setInterval(() => {
      this.refreshData();
    }, 1000);

  }

  ionViewDidLeave() : void {
    clearInterval(this.task);
  }

  private refreshData(): void {
    let currentData: number = this.chart.data.datasets[0].data[this.dataIndex++];
    if (currentData > this.endTappingValue) {
      // this.modelService.setCurrentFlow(currentData);
      this.chart.data.datasets[0].data[this.dataIndex] = currentData;
      this.chart.data.labels[this.dataIndex] = this.dataIndex.toString();
    } else {
      this.chart.data.datasets[0].data.push(this.endTappingValue);

      if (this.chart.data.datasets[0].data[0] != this.endTappingValue) {
        this.chart.data.datasets[0].data.shift();
      } else {
        clearInterval(this.task);
      }
    }
    // console.log("****** " + this.Chart.data.datasets[0].data);
    if (this.chart.data.datasets[0].data.length > this.maxNumOfPoints) {
      this.chart.data.datasets[0].data = this.chart.data.datasets[0].data.slice(this.chart.data.datasets[0].data.length - this.maxNumOfPoints, this.chart.data.datasets[0].data.length);
      this.dataIndex = this.maxNumOfPoints - 1;
    }
    // console.log("------ " + this.Chart.data.datasets[0].data);
    this.valveOffChart.data = this.chart.data;
    this.chart.update(0);
    this.valveOffChart.update(0);
  }

  updateCurrentValue(): void {
    console.log("***tap");
    let currentData: number = this.chart.data.datasets[0].data[this.dataIndex++];
    if (currentData > this.endTappingValue) {
      let changeData = Math.floor(Math.random() * 10);
      if (currentData - changeData < this.endTappingValue) {
        changeData = currentData - this.endTappingValue;
      }
      this.modelService.setCurrentFlow(currentData - changeData);
      this.chart.data.datasets[0].data[this.dataIndex] = this.modelService.getCurrentFlow();
      this.chart.data.labels[this.dataIndex] = this.dataIndex.toString();
    }
  }

  text(): string {
    return this.chart != undefined && this.chart!=null && this.chart.data.datasets[0].data[this.dataIndex] === 0 ? "Seems like the water flow stopped:" : "If there is still some flow suggest to:";
  }

  refreshDataValve(): void {
    this.valveOffChart.data.datasets[0].data.push(0);
    if (this.valveOffChart.data.datasets[0].data[0] != 0) {
      this.valveOffChart.data.datasets[0].data.shift();
    } else {
      clearInterval(this.taskValve);
    }
    this.chart.data = this.valveOffChart.data;
    this.chart.update(0);
    this.valveOffChart.update(0);

  }

  nextState(): void {
    this.state++;
  }

  prevState(): void {
    this.state--;
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
            this.valveStatus = 0;
          }
        },
        {
          text: "Yes",
          handler: () => {
            console.log("Yes clicked.");
            this.valveStatus = 1;
            clearInterval(this.task);
            this.taskValve = setInterval(() => {
              this.refreshDataValve();
            }, 300);
            this.modelService.toggleAllValves(false);
          }
        }
      ]
    });
    alert.present();
  }
}

