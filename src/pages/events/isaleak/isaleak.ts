import { ViewChild, Component } from "@angular/core";
import { Navbar, AlertController, IonicPage, NavController, NavParams, Alert } from "ionic-angular";
import { Chart } from "chart.js";
import { Camera, CameraOptions } from "@ionic-native/camera";
import { ModelService } from "../../../providers/model-service";
import { PlumbersPage } from "../../plumbers/plumbers";
import { asEvent } from "../../../lib/interfaces";

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
  public currentEvent: asEvent;
  public step: number = 0;
  private chart: Chart;
  private task: number;
  private endTappingValue: number;
  private maxNumOfPoints: number = 12;

  @ViewChild(Navbar) navBar: Navbar;

  @ViewChild("sourceOffCanvas") sourceOffCanvas;

  constructor(private camera: Camera, public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, private modelService: ModelService) {
    // If we navigated to this page, we will have an item available as a nav param
    this.endTappingValue = Math.random() < 0.5 ? 2 : 0;
    this.currentEvent = navParams.get("event");
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

  nextStep(): void {
    this.step++;
  }

  prevStep(): void {
    this.step--;
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
