import { ViewChild, Component } from "@angular/core";
import { Navbar, AlertController, IonicPage, NavController, NavParams } from "ionic-angular";
import { NotALeakPage } from "../notaleak/notaleak";
import { Chart } from "chart.js";
import { ModelService } from "../../../lib/model-service";

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
  alert: any;
  state: any;
  someOneHome: boolean;
  @ViewChild(Navbar) navBar: Navbar;

  dataIndex: any;
  @ViewChild("sourceOffCanvas") sourceOffCanvas;
  chart: any;
  task: any;
  taskValve: any;
  valveStatus: any;

  leakCloseSuccess: any;


  @ViewChild("valveOffCanvas") valveOffCanvas;
  chartValve: any;
  taskValveOff: any;

  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, private modelService: ModelService) {
    this.state = 0;
    this.someOneHome = false;
    this.dataIndex = 0;
    this.valveStatus = 0;
    this.leakCloseSuccess = Math.random() < 0.5 ? 2 : 0;
    this.alert = navParams.get("alert");
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

    let chartOffDefine = {
      type: "line",
      data: {
        labels: ["0", "1", "2", "3", "4", "5", "6", "7"],
        datasets: [{
          data: [19, 19, 19, 19, 19, 19, 19, 19],
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
    this.chartValve = new Chart(this.valveOffCanvas.nativeElement, chartOffDefine);
  }

  refreshData() {
    let currentData = this.chart.data.datasets[0].data[this.dataIndex++];
    if (currentData > this.leakCloseSuccess) {
      let changeData = Math.floor(Math.random() * 5);
      if (currentData - changeData < this.leakCloseSuccess) {
        changeData = currentData - this.leakCloseSuccess;
      }
      this.chart.data.datasets[0].data[this.dataIndex] = currentData - changeData;
      this.chart.data.labels[this.dataIndex] = this.dataIndex.toString();
    }
    else {
      this.chart.data.datasets[0].data.push(this.leakCloseSuccess);

      if (this.chart.data.datasets[0].data[0] != this.leakCloseSuccess) {
        this.chart.data.datasets[0].data.shift();
      }
      else {
        clearInterval(this.task);
      }

    }
    this.chart.update(0);
  }

  refreshDataValve() {
    this.chart.data.datasets[0].data.push(0);
    if (this.chart.data.datasets[0].data[0] != 0) {
      this.chart.data.datasets[0].data.shift();
    }
    else {
      clearInterval(this.taskValve);
    }
    this.chart.update(0);

  }

  refreshDataValveoff() {
    this.chartValve.data.datasets[0].data.push(0);
    if (this.chartValve.data.datasets[0].data[0] != 0) {
      this.chartValve.data.datasets[0].data.shift();
    }
    else {
      clearInterval(this.taskValveOff);
    }
    this.chartValve.update(0);

  }

  shutValve() {
    let alert = this.alertCtrl.create({
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

  shutValveOff() {
    let alert = this.alertCtrl.create({
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
            this.taskValveOff = setInterval(() => {
              this.refreshDataValveoff();
            }, 300);
            this.modelService.toggleAllValves(false);
          }
        }
      ]
    });
    alert.present();

  }

  nextState() {
    this.state++;
  }

  prevState() {
    this.state--;
  }

  PressYes() {
    this.someOneHome = true;
  }

  PressNo() {
    this.someOneHome = false;
    this.state++;
  }

  PressNoLeak() {
    this.navCtrl.pop();
    this.navCtrl.push(NotALeakPage, {
      alert: this.alert
    });

  }

  PressRealLeak() {
    this.state++;
    this.task = setInterval(() => {
      this.refreshData();
    }, 300);
  }
}

