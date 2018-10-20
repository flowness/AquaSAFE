import { Component } from "@angular/core";
import { IonicPage, NavController, Platform, LoadingController, Loading } from "ionic-angular";
import { HomePage2 } from "../../home.2/home2";
import { ModelService } from "../../../providers/model-service";
import { GlobalsService } from "../../../providers/Globals-service";

import * as HighCharts from "highcharts";
import * as HighchartsMore from "highcharts/highcharts-more";
HighchartsMore(HighCharts);
import { Http } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import { StatusEventService, GlobalSystemSeverityTypes } from "../../../providers/StatusEvent-service";
import { TranslateService } from '@ngx-translate/core';

/**
 * Generated class for the MenuStatisticsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-statistics",
  templateUrl: "statistics.html"
})
export class StatisticsPage {
  private unregisterFunc: Function;
  private accountName: string = "";
  private chart: any;
  chartType: string = "live";
  private task: number = -1;
  private liveUrl: string =
    "https://yg8rvhiiq0.execute-api.eu-west-1.amazonaws.com/poc/currentflow?moduleSN=";
  private volumeUrl: string =
    "https://yg8rvhiiq0.execute-api.eu-west-1.amazonaws.com/poc/volume";


  private eraOfChart: string = "N/A";
  private months: string[] = new Array("Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec");
  private loading: Loading;

  constructor(
    public navCtrl: NavController,
    platform: Platform,
    public modelService: ModelService,
    private http: Http,
    public loadingCtrl: LoadingController,
    private globalsService: GlobalsService,
    private statusEventService: StatusEventService,
    public translate: TranslateService
  ) {
    this.unregisterFunc = platform.registerBackButtonAction(() => {
      this.backButton();
    });
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad StatisticsPage");
    this.globalsService.getAccountName().then((account) => { 
      this.accountName = account; 
    });

    this.onSegmentChange();
  }

  onSegmentChange(): void {
    console.log("segment changed: " + this.chartType);
    if (this.task >= 0) {
      console.log("CLEARINTERVAL");
      clearInterval(this.task);
    }
    if (this.chartType === "live") {
      this.drawLiveChart();
      this.task = setInterval(() => {
        this.refreshLiveData();
      }, 1000);
    } else {
      this.drawBarChart();
    }
  }

  private refreshLiveData() {
    let cur_URL = this.liveUrl + this.accountName;
    this.getJSONDataAsync(cur_URL).then(data => {
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
      if (flow < 0)
      {
        flow = 0;
      }
      this.chart.series[0].addPoint(flow, true, true);
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



  private drawLiveChart(): void {
    let graphTitle = ""
    this.translate.get("REAL_TIME_GRAPH_TITLE").subscribe(value => {graphTitle = value;});

    let chartConfig = {
      title: {
        text: graphTitle
      },
      tooltip: {
        enabled: false
      },
      yAxis: {
        title: {
          enabled: false
        },
        min: 0
      },
      xAxis: {
        labels: {
          enabled: false
        }
      },
      credits: {
        enabled: false
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        series: {
          label: {
            connectorAllowed: false
          },
          marker: {
            enabled: false
          }
        }
      },

      series: [
        {
          name: "Consumption",
          data: (function () {
            var data = [],
              i;
            for (i = 0; i < 30; i += 1) {
              data.push([0]);
            }
            return data;
          })(),
          marker: {
            enabled: false,
            radius: 0
          }
        }
      ],

      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 500
            },
            chartOptions: {
              legend: {
                layout: "horizontal",
                align: "center",
                verticalAlign: "bottom"
              }
            }
          }
        ]
      }
    };
    this.chart = HighCharts.chart("container", chartConfig);
  }
  
  private drawBarChart(): void {
    this.loading.present();

    let volumeBodyDay = {moduleSN: this.accountName,Period: "Day" };
    let volumeBodyHour = {moduleSN: this.accountName,Period: "Hour" };


    var volumePostRequestBody = this.chartType === "daily" ? volumeBodyHour : volumeBodyDay
    let graphTitle = "";
    let graphDate = "";

    this.postJSONDataAsync(this.volumeUrl, volumePostRequestBody).then(data => {
      if (
        data != undefined &&
        data["statusCode"] != undefined &&
        data["statusCode"] == 200
      ) {
        // console.log(data["body"]);
        let jsonBody = JSON.parse(data["body"]);
        console.log(jsonBody);
        this.translate.get("MONTH_NAME_" + jsonBody[0]["month"]).subscribe(value => {graphDate = value;});
        if (this.chartType == "daily") {
            this.translate.get("DAY_GRAPH_TITLE").subscribe(value => {graphTitle = value;});
            let x = jsonBody[0]["day"] + graphDate;
            graphDate = x;
        }
        else 
            this.translate.get("MONTH_GRAPH_TITLE").subscribe(value => {graphTitle = value;});
        

        var preparedData: any[] = this.prepareData(jsonBody);

        this.chart = {
          chart: {
            type: "column"
          },
          title: {
            text: graphTitle + " - " + graphDate
          },
          subtitle: {
            // text:
            //   "Source: <a href="http://en.wikipedia.org/wiki/List_of_cities_proper_by_population">Wikipedia</a>"
          },
          xAxis: {
            type: "category",
            labels: {
              rotation: -45,
              style: {
                fontSize: "13px",
                fontFamily: "Verdana, sans-serif"
              }
            }
          },
          yAxis: {
            min: 0,
            title: {
              enabled: false
              // text: "Population (millions)"
            }
          },
          credits: {
            enabled: false
          },
          legend: {
            enabled: false
          },
          series: [
            {
              name: "Usage",
              data: preparedData,
              dataLabels: {
                enabled: false,
                rotation: -90,
                color: "#FFFFFF",
                align: "right",
                format: "{point.y:.1f}", // one decimal
                y: 10, // 10 pixels down from the top
                style: {
                  fontSize: "13px",
                  fontFamily: "Verdana, sans-serif"
                }
              }
            }
          ]
        };

        this.chart = HighCharts.chart("container", this.chart);
        this.loading.dismiss();
        this.loading = this.loadingCtrl.create({
          content: 'Please wait...'
        });
    
      }
    });
  }

  private prepareData(jsonBody): any[] {
    let ret: any[] = [];
    let dataXAxisKey: string = this.chartType === "daily" ? "hour" : "day";
    for (let index = 0; index < jsonBody.length; index++) {
      console.log(jsonBody[index]);
      let dataValue = parseInt(jsonBody[index]["flow"]);
      if (dataValue < 0) {
        dataValue = 0;
      }
      ret.push([jsonBody[index][dataXAxisKey], dataValue]);
      this.eraOfChart = this.months[parseInt(jsonBody[index]["month"]) - 1];
      if (this.chartType === "daily") {
        const dayInt = parseInt(jsonBody[index]["day"]);
        this.eraOfChart = this.months[parseInt(jsonBody[index]["month"]) - 1] + " " + dayInt + this.dayOfMonthSyffix(dayInt);
      }
    }
    // console.dir(ret);
    ret.sort(function(a, b){return a[0] - b[0]})
    // console.dir(ret);
    return ret;
  }

  private dayOfMonthSyffix(dom: number): string {
    if (dom >= 11 && dom <= 13) {
      return "th";
    }
    switch (dom % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  }

  private backButton(): void {
    this.navCtrl.setRoot(HomePage2);
  }

  ionViewDidLeave(): void {
    this.unregisterFunc();
    if (this.task >= 0) {
      clearInterval(this.task);
    }
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
    this.loading.dismiss();
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    return Observable.throw(errMsg);
  }
}
