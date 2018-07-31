import { ViewChild, Component } from "@angular/core";
import { Navbar, AlertController, IonicPage, NavController, NavParams, Alert } from "ionic-angular";
import { Chart } from "chart.js";
import { Camera, CameraOptions } from "@ionic-native/camera";
import { ModelService } from "../../../lib/model-service";
import { PlumbersPage } from "../../plumbers/plumbers";

/**
 * Generated class for the IsaleakPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-isaleak",
  templateUrl: "isaleak.html",
})
export class IsALeakPage {
  public base64Image: string;
  item: any;
  alert: any;
  state: number = 0;
  private chart: Chart;
  private task: number;
  private taskValve: any;
  valveStatus: number = 0;
  private leakCloseSuccess: number;
  private dataIndex: number = 0;

  @ViewChild(Navbar) navBar: Navbar;

  @ViewChild("sourceOffCanvas") sourceOffCanvas;

  constructor(private camera: Camera, public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, private modelService: ModelService) {
    // If we navigated to this page, we will have an item available as a nav param
    this.leakCloseSuccess = Math.random() < 0.5 ? 2 : 0;
    this.alert = navParams.get("alert");
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

  ionViewDidLoad(): void {
    console.log("ionViewDidLoad IsALeakPage");
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
    }, 300);

  }

  refreshData(): void {
    let currentData: number = this.chart.data.datasets[0].data[this.dataIndex++];
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

  refreshDataValve(): void {
    this.chart.data.datasets[0].data.push(0);
    if (this.chart.data.datasets[0].data[0] != 0) {
      this.chart.data.datasets[0].data.shift();
    }
    else {
      clearInterval(this.taskValve);
    }
    this.chart.update(0);

  }

  nextState(): void {
    this.state++;
  }

  prevState(): void {
    this.state--;
  }

  plumbers(): void {
    this.navCtrl.push(PlumbersPage);
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
