import { ViewChild,Component } from '@angular/core';
import {Navbar, AlertController,IonicPage, NavController, NavParams } from 'ionic-angular';

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
  item: any;
  alert: any;
  state: any;
  @ViewChild(Navbar) navBar: Navbar;

  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
      this.state=0;
      this.item = navParams.get('item');
      this.alert = navParams.get('alert');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IsALeakPage');
    this.navBar.backButtonClick= (e:UIEvent)=>{
      let alert = this.alertCtrl.create({
        title: 'Confirmation',
        message: 'is leak resolved',
        buttons: [
          {
            text: 'No',
            handler: () => {
              console.log('No clicked');
            }
          },
          {
            text: 'Yes',
            handler: () => {
              console.log('Yes clicked');
              this.navCtrl.pop();
            }
          }
        ]
      });
   
      alert.present();
    };
  }

  nextState()
  {
    this.state++;
  }

  prevState()
  {
    this.state--;
  }
}
