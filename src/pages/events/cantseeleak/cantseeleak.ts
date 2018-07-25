import { ViewChild, Component } from '@angular/core';
import { Navbar, AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Chart } from 'chart.js';
import { ModelService } from '../../../app/model-service';

/**
 * Generated class for the CantseeLeakPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cantseeleak',
  templateUrl: 'cantseeleak.html',
})
export class CantseeLeakPage {

  alert: any;
  state: any;
  endValue: number;
  dataIndex: any;
  Chart: any;
  task: any;
  valveOffChart: any;
  taskValve: any;
  valveStatus: any;
  maxNumOfPoints: number;

  @ViewChild(Navbar) navBar: Navbar;

  @ViewChild('sourceOffCanvas') sourceOffCanvas;

  @ViewChild('valveOffCanvas') valveOffCanvas;


  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, private modelService: ModelService) {
    this.state = 0;
    this.dataIndex = 0;
    this.valveStatus = 0;
    this.alert = navParams.get('alert');
    this.endValue =  Math.floor(Math.random() * 31) % 2 == 0 ? 2 : 0;
    this.maxNumOfPoints = 25;
  }

  ionViewDidLoad() {
    // let start = Math.floor(Math.random() * 31) + 19; //rand between 19-100
    let start = 19;
    console.log('ionViewDidLoad CantseeLeakPage');
    let chartDefine = {
      type: 'line',
      data: {
        labels: ['0'],
        datasets: [{
          data: [start],
          borderWidth: 1,
          backgroundColor: '#0062ff',
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
              max: start + 2
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

    this.valveOffChart = new Chart(this.valveOffCanvas.nativeElement, chartDefine);

    this.Chart = new Chart(this.sourceOffCanvas.nativeElement, chartDefine);

    this.task = setInterval(() => {
      this.refreshData();
    }, 300);

  }

  refreshData() {
    let currentData = this.Chart.data.datasets[0].data[this.dataIndex++];
    if (currentData > this.endValue) {
      // let changeData = Math.floor(Math.random() * 10);
      // if (currentData - changeData < this.endValue) {
      //   changeData = currentData - this.endValue;
      // }
      this.Chart.data.datasets[0].data[this.dataIndex] = currentData;
      this.Chart.data.labels[this.dataIndex] = this.dataIndex.toString();
    } else {
      this.Chart.data.datasets[0].data.push(this.endValue);

      if (this.Chart.data.datasets[0].data[0] != this.endValue) {
        this.Chart.data.datasets[0].data.shift();
      } else {
        clearInterval(this.task);
      }

    }
    // console.log('****** ' + this.Chart.data.datasets[0].data);
    if (this.Chart.data.datasets[0].data.length > this.maxNumOfPoints) {
      this.Chart.data.datasets[0].data = this.Chart.data.datasets[0].data.slice(this.Chart.data.datasets[0].data.length-this.maxNumOfPoints,this.Chart.data.datasets[0].data.length);
      this.dataIndex = this.maxNumOfPoints-1;
    }
    // console.log('------ ' + this.Chart.data.datasets[0].data);
    this.valveOffChart.data = this.Chart.data;
    this.Chart.update(0);
    this.valveOffChart.update(0);
  }

  updateCurrentValue() {
    console.log("***tap");
    let currentData = this.Chart.data.datasets[0].data[this.dataIndex++];
    if (currentData > this.endValue) {
      let changeData = Math.floor(Math.random() * 7);
      if (currentData - changeData < this.endValue) {
        changeData = currentData - this.endValue;
      }
      this.Chart.data.datasets[0].data[this.dataIndex] = currentData - changeData;
      this.Chart.data.labels[this.dataIndex] = this.dataIndex.toString();
    }
  }

  refreshDataValve() {
    this.valveOffChart.data.datasets[0].data.push(0);
    if (this.valveOffChart.data.datasets[0].data[0] != 0) {
      this.valveOffChart.data.datasets[0].data.shift();
    } else {
      clearInterval(this.taskValve);
    }
    this.Chart.data = this.valveOffChart.data;
    this.Chart.update(0);
    this.valveOffChart.update(0);

  }

  nextState() {
    this.state++;
  }

  prevState() {
    this.state--;
  }

  shutValve() {
    let alert = this.alertCtrl.create({
      title: 'Confirmation',
      message: 'Are you sure you want to close the main valve?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('No clicked');
            this.valveStatus = 0;
          }
        },
        {
          text: 'Yes',
          handler: () => {
            console.log('Yes clicked.');
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

