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
  @ViewChild(Navbar) navBar: Navbar;

  dataIndex: any;
  @ViewChild('sourceOffCanvas') sourceOffCanvas;
  Chart: any;
  task: any;

  @ViewChild('valveOffCanvas') valveOffCanvas;
  valveOffChart: any;
  taskValve: any;
  valveStatus: any;


  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams) {
    this.state = 0;
    this.dataIndex = 0;
    this.valveStatus = 0;
    this.alert = navParams.get('alert');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CantseeLeakPage');
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
              display: false,
              min: 0,
              max: 20
            }

          }],
          xAxes: [{
            ticks: {
              display: false,
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
    if (currentData > 2) {
      let changeData = Math.floor(Math.random() * 5);
      if (currentData - changeData < 2) {
        changeData = currentData - 2;
      }
      this.Chart.data.datasets[0].data[this.dataIndex] = currentData - changeData;
      this.Chart.data.labels[this.dataIndex] = this.dataIndex.toString();
    }
    else {
      this.Chart.data.datasets[0].data.push(2);

      if (this.Chart.data.datasets[0].data[0] != 2) {
        this.Chart.data.datasets[0].data.shift();
      }
      else {
        clearInterval(this.task);
      }

    }
    this.valveOffChart.data = this.Chart.data;
    this.Chart.update(0);
    this.valveOffChart.update(0);
  }

  refreshDataValve() {

    this.valveOffChart.data.datasets[0].data.push(0);
    if (this.valveOffChart.data.datasets[0].data[0] != 0) {
      this.valveOffChart.data.datasets[0].data.shift();
    }
    else {
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

