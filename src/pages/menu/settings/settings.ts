import { Component } from "@angular/core";
import { NavController, NavParams, AlertController, LoadingController, Platform } from "ionic-angular";
//import { ModelService } from "../../../providers/model-service";
import { HomePage2 } from "../../home.2/home2";
import { StatusEventService, Statuses, SystemStatusEvent } from "../../../providers/StatusEvent-service";
import { Storage } from '@ionic/storage';
import { GlobalsService} from "../../../providers/Globals-service";

@Component({
  selector: "page-settings",
  templateUrl: "settings.html"
})
export class SettingsPage {
  items: Array<{ title: string, input: string, icon: string, value: any }>;
  statuses = ["Low Battery", "Tamper", "Communication", "OK"];
  unregisterFunc: Function;

  txtAccountName: string = "";
  txtEmail: string = "";
  txtPhone: string = "";
  freezeAlert: boolean = false;
  continuesFlowAlert: boolean = false;
  noFlowAlert: boolean = false;

  constructor(public alertCtrl: AlertController, 
              public navCtrl: NavController, 
              public navParams: NavParams, 
              public loadingCtrl: LoadingController, 
              //private modelService: ModelService, 
              private statusEventService: StatusEventService,
              private storage: Storage,
              private globalsService: GlobalsService,
              platform: Platform) {
    this.unregisterFunc = platform.registerBackButtonAction(() => {
      this.backButton();
    });


/*     this.storage.get('txtAccountName').then((data)=>{this.txtAccountName = data;});
    this.storage.get('txtEmail').then((data)=>{this.txtEmail = data;});
    this.storage.get('txtPhone').then((data)=>{this.txtPhone = data;});
    this.storage.get('freezeAlert').then((data)=>{this.freezeAlert = data;});
    this.storage.get('continuesFlowAlert').then((data)=>{this.continuesFlowAlert = data;});
    this.storage.get('noFlowAlert').then((data)=>{this.noFlowAlert = data;});
 */  }

  ngAfterViewInit  () {
    this.txtAccountName = this.globalsService.AccountName;
    this.txtEmail = this.globalsService.Email;
    this.txtPhone = this.globalsService.Phone;
    this.freezeAlert = this.globalsService.freezeAlert;
    this.continuesFlowAlert = this.globalsService.continuesFlowAlert;
    this.noFlowAlert = this.globalsService.noFlowAlert;
  }

  private backButton(): void {
    this.navCtrl.setRoot(HomePage2);
  }

  ionViewDidLeave(): void {
    this.unregisterFunc();
  }


  storeData() {
    console.log(this.txtAccountName);
    console.log(this.txtEmail);
    console.log(this.txtPhone);
    console.log(this.freezeAlert);
    console.log(this.continuesFlowAlert);
    console.log(this.noFlowAlert);

    
    this.globalsService.AccountName = this.txtAccountName;
    this.globalsService.Email = this.txtEmail;
    this.globalsService.Phone = this.txtPhone;
    this.globalsService.freezeAlert = this.freezeAlert;
    this.globalsService.continuesFlowAlert = this.continuesFlowAlert;
    this.globalsService.noFlowAlert = this.noFlowAlert;

    this.globalsService.storeData();



/*     this.storeLocalData ("txtAccountName",this.txtAccountName);
    this.storeLocalData("txtEmail",this.txtEmail);
    this.storeLocalData("txtPhone",this.txtPhone);
    this.storeLocalData("freezeAlert",this.freezeAlert);
    this.storeLocalData("continuesFlowAlert",this.continuesFlowAlert);
    this.storeLocalData("noFlowAlert",this.noFlowAlert); */
  }

}
