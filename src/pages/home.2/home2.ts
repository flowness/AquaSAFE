import { Component } from "@angular/core";
import { NavController,NavParams,LoadingController,AlertController,Alert,Platform} from "ionic-angular";
import { Http } from "@angular/http";
import { Page } from "ionic-angular/umd/navigation/nav-util";
import { ScreenOrientation } from "@ionic-native/screen-orientation";

import * as HighCharts from "highcharts";
import * as HighchartsMore from "highcharts/highcharts-more";
import * as SolidGauge from "highcharts/modules/solid-gauge";

import { TranslateService } from '@ngx-translate/core';

// In-Project imports
import { MP100Page } from "../modules/mp100/mp100";
import { StatusEventService, GlobalSystemSeverityTypes } from "../../providers/StatusEvent-service";
import { HandleLeakPage } from "../handle-leak/handle-leak";
import { AsyncJSONService } from "../../providers/Async-JSON-service";
import { FlowService } from "../../providers/Flow-service";
import { GlobalsService} from "../../providers/Globals-service";

// Highcharts Initialization ?
HighchartsMore(HighCharts);
SolidGauge(HighCharts);


@Component({
  selector: "page-home",
  templateUrl: "home2.html"
})
export class HomePage2 {
  private pages: Page[] = [MP100Page];
  private flowChart: HighCharts.chart;
  private intervalRefreshGaugeTask: number;
  private intervalUpdateSystemSeverity: number;
  private systemStatusImageURL: string;
  private GlobalSystemSeverity: GlobalSystemSeverityTypes = GlobalSystemSeverityTypes.UNKNOWN;
  private accountName: string = "";
  private MLright = "Default-MLright";
  private MLleft = "Default-MLleft";

  constructor(
    private http: Http,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private statusEventService: StatusEventService,
    private flowService: FlowService,
    private screenOrientation: ScreenOrientation,
    public platform: Platform,
    private globalsService: GlobalsService,
    public translate: TranslateService
  ) {
    console.log("constructor home");
    console.log("direction from home2 = " + platform.dir());
    //this.lang = 'he';
    //this.translate.setDefaultLang('he');
    //this.translate.use('he');

    //this.translate.use(this.lang);

    //this.globalsService.loadDataFromStorage();
    if (!this.platform.is("mobileweb") && !this.platform.is("core")) {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    } else {
      //desktop browser only code
    }
    

  }

  
private setHiddenGauge() {
  return this.statusEventService.isLiveEventInSystem();
      
}

ionViewDidLoad(): void { 
/*     console.log("ionViewDidLoad home");     
    console.log("AccountName1 = " + this.globalsService.getAccountName());
    console.log("ionViewDidLoad 2 home");     
 */    
    this.globalsService.getAccountName().then((account) => { 
      this.accountName = account; 
      console.log("Home2 Account Name = " + this.accountName);
    });
    
  } 

  ngAfterViewInit  () {
  }

  private setGauge () {
        var gaugeOptions = {
          chart: {
//            spacing: [0, 0, 0, 0],
            marginBottom: 0,
            marginLeft: 0,
            marginRight: 0,
            marginTop: this.statusEventService.isLiveEventInSystem()!=false?0:10,

           // height: 80,
            //width: 100,
            type: 'solidgauge',
            height: this.statusEventService.isLiveEventInSystem()!=false?'33%':'75%',
            //height:100,
            backgroundColor: '#FFFFFF'
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
              format: '<div style="text-align:center"><span style="' + this.getGaugeLabelStyle() + '">' + this.MLleft + ' {y} ' + this.MLright + '</span><span></span></div>'
            }
          }],
          plotOptions: {
            solidgauge: {
              dataLabels: {
                y: 8,
                borderWidth: 0,
                useHTML: true
              }
            }
          }
        };        
      this.flowChart = HighCharts.chart('gauge', gaugeOptions);
      
  }

  private getGaugeLabelStyle () {
    if(this.statusEventService.isLiveEventInSystem()==false)
      return 'font-size:20px;color:black;';
    else
      return 'font-size:16px;color:black;';
  }

  ionViewWillEnter(): void {
    console.log("ionViewWillEnter home");

    this.translate.get('MILLILITER_SHORT_R').subscribe(value => {this.MLright = value;});
    this.translate.get('MILLILITER_SHORT_L').subscribe(value => {this.MLleft = value;});

    this.globalsService.readyDoneReading().then(() => { 
      console.log("********^^^^^**** DONE READING = " + this.globalsService.doneReading);

    this.setGauge();
    this.intervalRefreshGaugeTask = setInterval(() => { this.refreshDataGauge(); }, 1000);
    this.updateStatusImage();
    this.intervalUpdateSystemSeverity = setInterval(() => { this.updateGlobalSystemSeverity(); }, 1000);

 
  });

  }

  private updateGlobalSystemSeverity () {
    let tempGlobalSystemSeverity = this.statusEventService.getGlobalSystemSeverity();
    if (this.GlobalSystemSeverity != tempGlobalSystemSeverity) {

      this.GlobalSystemSeverity = tempGlobalSystemSeverity;
      this.updateStatusImage();
      //this.setGauge();
    }
  }

  private updateStatusImage(): void {
    /*
    switch (this.GlobalSystemSeverity)
    {
        case (GlobalSystemSeverityTypes.UNKNOWN): this.systemStatusImageURL = "assets/imgs/front_resized.png"; break;
        case (GlobalSystemSeverityTypes.NORMAL): this.systemStatusImageURL = "assets/imgs/front_resized_OK.png"; break;
        case (GlobalSystemSeverityTypes.ALERT): this.systemStatusImageURL = "assets/imgs/front_resized_Leak.png"; break;
        case (GlobalSystemSeverityTypes.WARNING): this.systemStatusImageURL = "assets/imgs/front_resized_Trouble.png"; break;
    }
    */
   let theImage = "";
   switch (this.GlobalSystemSeverity) {
       case (GlobalSystemSeverityTypes.UNKNOWN): theImage = "STATUS_IMG_UNKNOWN"; break;
       case (GlobalSystemSeverityTypes.NORMAL): theImage = "STATUS_IMG_OK"; break;
       case (GlobalSystemSeverityTypes.ALERT): theImage = "STATUS_IMG_ALERT"; break;
       case (GlobalSystemSeverityTypes.WARNING): theImage = "STATUS_IMG_TROUBLE"; break;
   }
   if (theImage != "")
      this.translate.get(theImage).subscribe(value => {this.systemStatusImageURL = value;});

  }

  private refreshDataGauge() { 
    if (this.statusEventService.isLiveEventInSystem()!=false)
      if (this.flowChart && this.flowChart.series)
        this.flowChart.series[0].points[0].update(this.flowService.getCurrentFlow());
   }

  moduleTapped(event: any, module: any): void {
    console.log("module type = " + module.type);
    this.navCtrl.push(this.pages[module.type], {
      module: module
    });
  }

  openHandleLeakPage(e: any): void {
    console.log("$$$$$$ HER HERE HERE");
    if (this.statusEventService.isLiveEventInSystem()!=false)
      this.navCtrl.push(HandleLeakPage, { eventID: e });
  }

  ionViewDidLeave(): void {
    clearInterval(this.intervalRefreshGaugeTask);
  }

}
