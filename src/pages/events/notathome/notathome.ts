import { ViewChild,Component } from '@angular/core';
import {Navbar, AlertController,IonicPage, NavController, NavParams } from 'ionic-angular';
import { NotALeakPage } from '../notaleak/notaleak';
import { Chart } from 'chart.js';

/**
 * Generated class for the NotathomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notathome',
  templateUrl: 'notathome.html',
})
export class NotathomePage {
  alert: any;
  state: any;
  someOneHome: boolean;
  @ViewChild(Navbar) navBar: Navbar;

  dataIndex:any;
  @ViewChild('sourceOffCanvas') sourceOffCanvas;
  Chart: any;
  task: any;
  taskValve: any;
  valveStatus:any;

  leakCloseSuccess:any;


  @ViewChild('valveOffCanvas') valveOffCanvas;
  ChartValve: any;
  taskValveOff: any;

  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams) {
      this.state=0;
      this.someOneHome=false;
      this.dataIndex=0;
      this.valveStatus=0;
      this.leakCloseSuccess=Math.random()<0.5?2:0;
      this.alert = navParams.get('alert');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotathomePage');
    // this.navBar.backButtonClick= (e:UIEvent)=>{
    //   let alert = this.alertCtrl.create({
    //     title: 'Confirmation',
    //     message: 'is leak resolved',
    //     buttons: [
    //       {
    //         text: 'No',
    //         handler: () => {
    //           console.log('No clicked');
    //           this.navCtrl.pop();
    //         }
    //       },
    //       {
    //         text: 'Yes',
    //         handler: () => {
    //           console.log('Yes clicked');
    //           this.navCtrl.pop();
    //         }
    //       }
    //     ]
    //   });
   
    //   alert.present();
    // };

    let chartDefine = {
      type: 'line',
     data: {
       labels: ['0'],
       datasets: [{
             data: [19],
             borderWidth: 1,
         }]
     },
     options: {
       responsive: false,
       legend: {
         display: false,
       },
         scales: {
             yAxes: [{
                 ticks: {
                     min: 0,
                     max: 20
                 }
                 
             }]
         }
     }
   }

   let chartOffDefine = {
    type: 'line',
   data: {
     labels: ['0','1','2','3','4','5','6','7'],
     datasets: [{
           data: [19,19,19,19,19,19,19,19],
           borderWidth: 1,
       }]
   },
   options: {
     responsive: false,
     legend: {
       display: false,
     },
       scales: {
           yAxes: [{
               ticks: {
                   min: 0,
                   max: 20
               }
               
           }]
       }
   }
 }

   this.Chart = new  Chart(this.sourceOffCanvas.nativeElement, chartDefine);
   this.ChartValve = new  Chart(this.valveOffCanvas.nativeElement, chartOffDefine);
  }

  refreshData()
  {
    let currentData=this.Chart.data.datasets[0].data[this.dataIndex++];
    if(currentData>this.leakCloseSuccess)
    {
      let changeData=Math.floor(Math.random()*5);
      if(currentData-changeData<this.leakCloseSuccess)
      {
        changeData=currentData-this.leakCloseSuccess;        
      }
      this.Chart.data.datasets[0].data[this.dataIndex] = currentData-changeData;
      this.Chart.data.labels[this.dataIndex] = this.dataIndex.toString();
    }
    else
    {
      this.Chart.data.datasets[0].data.push(this.leakCloseSuccess);

      if(this.Chart.data.datasets[0].data[0]!=this.leakCloseSuccess) 
      {
        this.Chart.data.datasets[0].data.shift();
      }
      else
      {
        clearInterval(this.task);
      }

    }
    this.Chart.update(0);
  }

  refreshDataValve()
  {
    this.Chart.data.datasets[0].data.push(0);
    if(this.Chart.data.datasets[0].data[0]!=0) 
    {
      this.Chart.data.datasets[0].data.shift();
    }
    else
    {
      clearInterval(this.taskValve);
    }
    this.Chart.update(0);

  }

  refreshDataValveoff()
  {
    this.ChartValve.data.datasets[0].data.push(0);
    if(this.ChartValve.data.datasets[0].data[0]!=0) 
    {
      this.ChartValve.data.datasets[0].data.shift();
    }
    else
    {
      clearInterval(this.taskValveOff);
    }
    this.ChartValve.update(0);

  }

  shutValve()
  {

      this.valveStatus=1;
      clearInterval(this.task);
      this.taskValve = setInterval(() => {
        this.refreshDataValve();
      }, 300);
  }

  shutValveOff()
  {
    this.taskValveOff = setInterval(() => {
      this.refreshDataValveoff();
    }, 300);
  
  }

  nextState()
  {
    this.state++;
  }

  prevState()
  {
    this.state--;
  }

  PressYes()
  {
    this.someOneHome=true;
  }

  PressNo()
  {
    this.someOneHome=false;
    this.state++;
  }

  PressNoLeak()
  {
    this.navCtrl.pop();
    this.navCtrl.push(NotALeakPage, {
      alert: this.alert
    });

  }

  PressRealLeak()
  {
    this.state++;
    this.task = setInterval(() => {
      this.refreshData();
    }, 300);
  }
}

