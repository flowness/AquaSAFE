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
  private task: number;
  private current: number = 30;
  private url: string =
    "https://yg8rvhiiq0.execute-api.eu-west-1.amazonaws.com/poc/currentflow?moduleSN=azarhome";

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
    this.drawLiveChart(this.http);
    this.task = setInterval(() => {
      this.refreshData();
    }, 2000);
  }

  private refreshData() {
    this.getJSONDataAsync(this.url).then(data => {
      // console.log(data);
      let flow: number = 0;
      if (
        data != undefined &&
        data["statusCode"] != undefined &&
        data["statusCode"] == 200
      ) {
        flow = data["body"]["Flow"];
      }
    });
  }

  // private updateLiveChart(f: number): void {
  //   console.log(f);
  //   this.chart.series[0].addPoint(f, true, true);
  // }

  public getJSONDataAsync(url: string): Promise<any> {
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

        var jsonRes = res.json();

        resolve(jsonRes);
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

  private drawLiveChart(http): void {
    this.chart = {
      title: {
        text: "CurrentFlow"
      },
      chart: {
        events: {
          load: function() {
            console.log("load called");
            // set up the updating of the chart each second
            var series = this.series[0];
            setInterval(function() {
              new Promise((resolve, reject) => {
                http.get("https://yg8rvhiiq0.execute-api.eu-west-1.amazonaws.com/poc/currentflow?moduleSN=azarhome").subscribe(res => {
                  if (!res.ok) {
                    reject(
                      "Failed with status: " +
                        res.status +
                        "\nTrying to find file at url"
                    );
                  }
          
                  var jsonRes = res.json();
          
                  resolve(jsonRes);
                });
              }).catch(reason => console.log(reason)).then(data => {
                // console.log(data);
                let flow: number = 0;
                if (
                  data != undefined &&
                  data["statusCode"] != undefined &&
                  data["statusCode"] == 200
                ) {
                  flow = data["body"]["Flow"];
                }
                series.addPoint(flow, true, true);
                console.log("flow=" + flow);
              });
              // var y = Math.round(Math.random() * 100);
            }, 1000);
          }
        }
      },
      yAxis: {
        title: {
          enabled: false
        },
        softMin: 0
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
          name: "Installation",
          data: (function() {
            // generate an array of random data
            console.log("data called");

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
    HighCharts.chart("container", this.chart);
  }

  private drawBarChart(): void {
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
          data: [
            ["Shanghai", 24.2],
            ["Beijing", 20.8],
            ["Karachi", 14.9],
            ["Shenzhen", 13.7],
            ["Guangzhou", 13.1],
            ["Istanbul", 12.7],
            ["Mumbai", 12.4],
            ["Moscow", 12.2],
            ["São Paulo", 12.0],
            ["Delhi", 11.7],
            ["Kinshasa", 11.5]
          ],
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

    HighCharts.chart("container", this.chart);
  }

  private backButton(): void {
    this.navCtrl.setRoot(HomePage);
  }

  ionViewDidLeave(): void {
    this.unregisterFunc();
  }
}
