import { ViewChild,Component } from '@angular/core';
import {Navbar, AlertController,IonicPage, NavController, NavParams } from 'ionic-angular';
import { Chart } from 'chart.js';
import {Camera,CameraOptions} from '@ionic-native/camera';

/**
 * Generated class for the IsaleakPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-isaleak',
  templateUrl: 'isaleak.html',
})
export class IsALeakPage {
  public base64Image: string;
  item: any;
  alert: any;
  state: any;
  @ViewChild(Navbar) navBar: Navbar;

  dataIndex:any;
  @ViewChild('sourceOffCanvas') sourceOffCanvas;
  Chart: any;
  task: any;
  taskValve: any;
  valveStatus:any;

  leakCloseSuccess:any;

  constructor(private camera: Camera,public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
      this.state=0;
      this.dataIndex=0;
      this.valveStatus=0;
      this.leakCloseSuccess=Math.random()<0.5?2:0;
      this.alert = navParams.get('alert');
  }

  takePicture(){

    const options: CameraOptions = {
       quality: 50,
       destinationType: this.camera.DestinationType.DATA_URL,
       encodingType: this.camera.EncodingType.JPEG,
       mediaType: this.camera.MediaType.PICTURE
     }
    
     this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
     }, (err) => {
      // Handle error
     });

 /*    this.camera.getPicture(this.onSuccess, this.onFail, options);*/
 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IsALeakPage');
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

   this.Chart = new  Chart(this.sourceOffCanvas.nativeElement, chartDefine);

   this.task = setInterval(() => {
    this.refreshData();
  }, 300);
  
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

  nextState()
  {
    this.state++;
  }

  prevState()
  {
    this.state--;
  }

  shutValve()
  {
    this.valveStatus=1;
    clearInterval(this.task);
    this.taskValve = setInterval(() => {
      this.refreshDataValve();
    }, 300);
  }

}
