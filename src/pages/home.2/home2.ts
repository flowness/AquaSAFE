import { Component } from "@angular/core";
import { NavController,NavParams,LoadingController,AlertController,Alert,Platform} from "ionic-angular";
import { Http } from "@angular/http";
import { Page } from "ionic-angular/umd/navigation/nav-util";
import { ScreenOrientation } from "@ionic-native/screen-orientation";

import * as HighCharts from "highcharts";
import * as HighchartsMore from "highcharts/highcharts-more";
import * as SolidGauge from "highcharts/modules/solid-gauge";

// In-Project imports
import { MP100Page } from "../modules/mp100/mp100";
//import { ModelService } from "../../providers/model-service";
import { HandleLeakPage } from "../handle-leak/handle-leak";
import { AsyncJSONService } from "../../providers/Async-JSON-service";
import { FlowService } from "../../providers/Flow-service";

// Highcharts Initialization ?
HighchartsMore(HighCharts);
SolidGauge(HighCharts);


@Component({
  selector: "page-home",
  templateUrl: "home2.html"
})
export class HomePage2 {
  private pages: Page[] = [MP100Page];
  private chart: HighCharts.chart;
  private intervalRefreshGaugeTask: number;
  private intervalRefreshStatusTask: number;
  private systemStatusCode: number = -1;
  private systemStatusImageURL: string;

  constructor(
    private http: Http,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    //private modelService: ModelService,
    private asyncJASONRequests: AsyncJSONService,
    private flowService: FlowService,
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

  ionViewDidLoad(): void { console.log("ionViewDidLoad home");  }

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
        data: [this.flowService.getCurrentFlow()],
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

    this.intervalRefreshGaugeTask = setInterval(() => { this.refreshDataGauge(); }, 1000);
    //this.intervalRefreshStatusTask = setInterval(() => { this.getStatus(); }, 2000);
  }

  private getStatus(): void {
      let systemStatusUrl: string = "https://yg8rvhiiq0.execute-api.eu-west-1.amazonaws.com/poc/status?SN=azarhome&period=7%20DAY&statusType=1";    
      this.asyncJASONRequests.getJSONDataAsync(systemStatusUrl).then(data => {
      let systemStatus: number = 0;
      if (
          data != undefined &&
          data["statusCode"] != undefined &&
          data["statusCode"] == 200
          ) {
                let statusLine = {};
                if (data.body.length > 0) {
                  for (var i of data.body) {
                    statusLine = JSON.parse(i);
                    systemStatus = 1;
                    
                    //this.modelService.addLeakageEventToModel("MP100", new Date());
                    //console.log("################ Added leak event");
                    
                    //this.modelService.updateSettings (statusLine["Event_str"],true);          
                    //this.modelService.setStatus("leak");                    
                  }
                }
                else { 
                  //console.log("^^^^^^^^  No Data.body");
                  //this.modelService.updateSettings ("",false);
                }
      }
      console.log("systemStatus = " + systemStatus);
      this.systemStatusCode = systemStatus;
      this.updateStatusImage();
    });
  }

  private updateStatusImage(): void {
    switch (this.systemStatusCode)
    {
        case -1: this.systemStatusImageURL = "assets/imgs/front_resized.png"; break;
        case 0: this.systemStatusImageURL = "assets/imgs/front_resized_OK.png"; break;
        case 1: this.systemStatusImageURL = "assets/imgs/front_resized_Leak.png"; break;
        case 2: this.systemStatusImageURL = "assets/imgs/front_resized_Trouble.png"; break;
    }
  }

  private refreshDataGauge() { 
    this.chart.series[0].points[0].update(this.flowService.getCurrentFlow());
   }

  moduleTapped(event: any, module: any): void {
    console.log("module type = " + module.type);
    this.navCtrl.push(this.pages[module.type], {
      module: module
    });
  }

  openHandleLeakPage(): void {
    this.navCtrl.push(HandleLeakPage);
  }

  ionViewDidLeave(): void {
    clearInterval(this.intervalRefreshGaugeTask);
    clearInterval(this.intervalRefreshStatusTask);
  }

}