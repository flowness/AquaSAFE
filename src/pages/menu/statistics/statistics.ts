import { Component } from "@angular/core";
import { IonicPage, NavController, Platform } from "ionic-angular";
import { HomePage } from "../../home/home";
import { ModelService } from "../../../providers/model-service";
import * as HighCharts from "highcharts";
import * as HighchartsMore from "highcharts/highcharts-more";
HighchartsMore(HighCharts);
import { Http } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";

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
  private chart: any;
  chartType: string = "live";
  private task: number = -1;
  private liveUrl: string =
    "https://yg8rvhiiq0.execute-api.eu-west-1.amazonaws.com/poc/currentflow?moduleSN=azarhome";
  private volumeUrl: string =
    "https://yg8rvhiiq0.execute-api.eu-west-1.amazonaws.com/poc/volume";
    private volumeBodyHour: any = {
      moduleSN: "azarhome",
      Period: "Hour"
    };
    private volumeBodyDay: any = {
      moduleSN: "azarhome",
      Period: "Day"
    };
      constructor(
    public navCtrl: NavController,
    platform: Platform,
    public modelService: ModelService,
    private http: Http
  ) {
    this.unregisterFunc = platform.registerBackButtonAction(() => {
      this.backButton();
    });
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad StatisticsPage");
    this.drawLiveChart();
    this.task = setInterval(() => {
      this.refreshData();
    }, 1000);
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
        this.refreshData();
      }, 1000);
    } else {
      this.drawBarChart();
    }
  }

  private refreshData() {
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
      this.updateLiveChart(flow);
    });
  }

  private updateLiveChart(f: number): void {
    console.log(f);
    this.chart.series[0].addPoint(f, true, true);
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
    return Observable.throw(errMsg);
  }

  private drawLiveChart(): void {
    let chartConfig = {
      title: {
        text: "CurrentFlow"
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
          },
          pointStart: 2010
        }
      },

      series: [
        {
          name: "Consumption",
          data: (function() {
            var data = [],
              i;
            for (i = 0; i < 30; i += 1) {
              data.push([0]);
            }
            return data;
          })()
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
    this.postJSONDataAsync(this.volumeUrl, this.chartType === "daily" ? this.volumeBodyHour : this.volumeBodyDay).then(data => {
      if (
        data != undefined &&
        data["statusCode"] != undefined &&
        data["statusCode"] == 200
      ) {
        // console.log(data["body"]);
        let jsonBody = JSON.parse(data["body"]);
        // console.log(jsonBody);

        var preparedData: any[] = this.prepareData(jsonBody);

        this.chart = {
          chart: {
            type: "column"
          },
          title: {
            text: "Water Usage"
          },
          subtitle: {
            // text:
            //   'Source: <a href="http://en.wikipedia.org/wiki/List_of_cities_proper_by_population">Wikipedia</a>'
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
      }
    });
  }

  private prepareData(jsonBody): any[] {
    let ret: any[] = [];
    for (let index = 0; index < jsonBody.length; index++) {
      console.log(jsonBody[index]);
      ret.push([this.chartType === "daily" ? jsonBody[index]["hour"] : jsonBody[index]["day"], parseInt(jsonBody[index]["flow"])]);
    }
    // console.dir(ret);
    // ret.sort(function(a, b){return a[0] - b[0]})
    // console.dir(ret);
    return ret;
  }

  private backButton(): void {
    this.navCtrl.setRoot(HomePage);
  }

  ionViewDidLeave(): void {
    this.unregisterFunc();
    if (this.task >= 0) {
      clearInterval(this.task);
    }
  }
}
