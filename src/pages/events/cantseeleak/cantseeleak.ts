import { ViewChild, Component } from '@angular/core';
import { Navbar, AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Chart } from 'chart.js';

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

  @ViewChild(Navbar) navBar: Navbar;

  @ViewChild('sourceOffCanvas') sourceOffCanvas;

  @ViewChild('valveOffCanvas') valveOffCanvas;


  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams) {
    this.state = 0;
    this.dataIndex = 0;
    this.valveStatus = 0;
    this.alert = navParams.get('alert');
    this.endValue =  Math.floor(Math.random() * 31) % 2 == 0 ? 2 : 0;
  }

  ionViewDidLoad() {
    let start = Math.floor(Math.random() * 31) + 19; //rand between 19-100
    console.log('ionViewDidLoad CantseeLeakPage');
    let chartDefine = {
      type: 'line',
      data: {
        labels: ['0'],
        datasets: [{
          data: [start],
          borderWidth: 1,
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
    console.log('****** ' + this.Chart.data.datasets[0].data);
    this.valveOffChart.data = this.Chart.data;
    this.Chart.update(0);
    this.valveOffChart.update(0);
  }

  updateCurrentValue() {
    console.log("***tap");
    let currentData = this.Chart.data.datasets[0].data[this.dataIndex++];
    if (currentData > this.endValue) {
      let changeData = Math.floor(Math.random() * 10);
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
    this.valveStatus = 1;
    clearInterval(this.task);
    this.taskValve = setInterval(() => {
      this.refreshDataValve();
    }, 300);
  }
}

