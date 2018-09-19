import { Component } from "@angular/core";
import {
  NavController,
  NavParams,
  LoadingController,
  AlertController,
  Alert,
  Platform
} from "ionic-angular";

import { MP100Page } from "../modules/mp100/mp100";
//import { Fd100Page } from "../modules/fd100/fd100";
//import { Vs100Page } from "../modules/vs100/vs100";
//import { Bs100Page } from "../modules/bs100/bs100";
//import { R100Page } from "../modules/r100/r100";

import { CantseeLeakPage } from "../events/cantseeleak/cantseeleak";
import { IsALeakPage } from "../events/isaleak/isaleak";
import { NotALeakPage } from "../events/notaleak/notaleak";
import { NotathomePage } from "../events/notathome/notathome";
import { ModelService } from "../../providers/model-service";
import { Page } from "ionic-angular/umd/navigation/nav-util";
import { DataFinder } from "../../providers/data-finder";
import { module } from "../../lib/interfaces";
import { HandleLeakPage } from "../handle-leak/handle-leak";
import { ScreenOrientation } from "@ionic-native/screen-orientation";
import * as HighCharts from "highcharts";
import * as HighchartsMore from "highcharts/highcharts-more";
import * as SolidGauge from "highcharts/modules/solid-gauge";
import { Http } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { Events } from 'ionic-angular';

HighchartsMore(HighCharts);
SolidGauge(HighCharts);

@Component({
  selector: "page-home",
  templateUrl: "home1.html"
})
export class HomePage1 {
  private pages: Page[] = [
    MP100Page //,
    //Fd100Page,
    //Vs100Page,
    //Bs100Page,
    //R100Page
  ];
  private chart: HighCharts.chart;
  private task: number;
  private taskStatus: number;
  private systemStatusCode: number = 0;
  private ststemStatusImageURL: string;

  constructor(
    private http: Http,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private modelService: ModelService,
    public dataFinder: DataFinder,
    private screenOrientation: ScreenOrientation,
    public platform: Platform
  ) {
    console.log("constructor home");
    if (!this.platform.is("mobileweb") && !this.platform.is("core")) {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    } else {
      //desktop browser only code
    }
  }

  ionViewDidLoad(): void {
    console.log("ionViewDidLoad home");
  }

  ionViewWillEnter(): void {
    console.log("ionViewWillEnter home");
    var gaugeOptions = {
      chart: {
        spacing: [0, 0, 0, 0],
        type: 'solidgauge',
        height: '50%',
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
        data: [this.modelService.getCurrentFlow()],
        dataLabels: {
          format: '<div style="text-align:center"><span style="font-size:20px;color:black">{y} ml</span></div>'
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

    this.chart = HighCharts.chart('gauge', gaugeOptions);
    
    this.updateStatusImage();

    this.task = setInterval(() => {
      this.refreshDataGauge();
    }, 1000);

    this.taskStatus = setInterval(() => {
      this.getStatus();
    }, 2000);
  }

  
  private systemStatusUrl: string =
  "https://yg8rvhiiq0.execute-api.eu-west-1.amazonaws.com/poc/status?SN=azarhome&period=7%20DAY&statusType=1";

  private getStatus(): void {
    this.getJSONDataAsync(this.systemStatusUrl).then(data => {
      // console.log(data);
      let systemStatus: number = 0;
      if (
        data != undefined &&
        data["statusCode"] != undefined &&
        data["statusCode"] == 200
      ) {
        console.log("data[body][Event_str] = " + data["body"]);

        if (Object.keys(data["body"]).length > 0 )
          systemStatus = 1;
      }
      console.log("systemStatus = " + systemStatus);
      //this.chart.series[0].addPoint(flow, true, true);
      //return flow;
      this.systemStatusCode = systemStatus;
      this.updateStatusImage();
    });
  }

  private updateStatusImage(): void {
    switch (this.systemStatusCode)
    {
        case 0: this.ststemStatusImageURL = "assets/imgs/front_resized_OK.png"; break;
        case 1: this.ststemStatusImageURL = "assets/imgs/front_resized_Leak.png"; break;
        case 2: this.ststemStatusImageURL = "assets/imgs/front_resized_Trouble.png"; break;
    }
  }

  private refreshDataGauge(): void {
    //this.modelService.setCurrentFlow(this.refreshLiveData());

    //this.chart.series[0].points[0].update(this.modelService.getCurrentFlow());
    //this.chart.series[0].points[0].update(this.refreshLiveData());
    this.refreshLiveData();
  }

  moduleTapped(event: any, module: any): void {
    console.log("module type = " + module.type);
    this.navCtrl.push(this.pages[module.type], {
      module: module
    });
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

  openHandleLeakPage(): void {
    this.navCtrl.push(HandleLeakPage);
  }

  ionViewDidLeave(): void {
    clearInterval(this.task);
  }

  handleToggleValveChange(checked: boolean, module: module): void {
    console.log("toggle1=" + module.valve + " checked=" + checked);
    if (checked === module.valve) {
      let alert: Alert = this.alertCtrl.create({
        title: "Confirmation",
        message:
          "Are you sure you want to " +
          (module.valve ? "open" : "close") +
          " the main valve?",
        buttons: [
          {
            text: "No",
            handler: () => {
              console.log("No clicked");
              module.valve = !module.valve;
            }
          },
          {
            text: "Yes",
            handler: () => {
              console.log("Yes clicked. checked = " + checked);
              module.valve = checked;
              this.modelService.toggleValve(module.sn, module.valve);
            }
          }
        ]
      });
      alert.present();
    }
  }

  private liveUrl: string =
  "https://yg8rvhiiq0.execute-api.eu-west-1.amazonaws.com/poc/currentflow?moduleSN=azarhome";

  private refreshLiveData(){
    this.getJSONDataAsync(this.liveUrl).then(data => {
      // console.log(data);
      let flow: number = 0;
      if (
        data != undefined &&
        data["statusCode"] != undefined &&
        data["statusCode"] == 200
      ) {
        flow = data["body"]["Flow"];
      }
      console.log(flow);
      //this.chart.series[0].addPoint(flow, true, true);
      //return flow;
      this.modelService.setCurrentFlow(flow);
      this.chart.series[0].points[0].update(this.modelService.getCurrentFlow());
    });
  }

  private getJSONDataAsync(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe(res => {
        if (!res.ok) {
          reject(
            "Failed with status: " +
            res.status +
            "\nTrying to find fil at " +
            url
          );
        }
        resolve(res.json());
      });
    }).catch(reason => this.handleError(reason));
  }

  private postJSONDataAsync(url: string, body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(url, body).subscribe(res => {
        if (!res.ok) {
          reject(
            "Failed with status: " +
            res.status +
            "\nTrying to find file at " +
            url
          );
        }
        resolve(res.json());
      });
    }).catch(reason => this.handleError(reason));
  }

  
  /* Takes an error, logs it to the console, and throws it */
  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || "";
      const err = JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ""} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
   // this.loading.dismiss();
   // this.loading = this.loadingCtrl.create({     content: 'Please wait...'});
    //return Observable.throw(errMsg);
  }



}