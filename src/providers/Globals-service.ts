import { Injectable } from "@angular/core";
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';


@Injectable()
export class GlobalsService {

    public AccountName = "";



    public async getAccountName () {
        if (this.AccountName == ""){
            console.log("Globals-Service - Account Name NOT assigned")
            return await this.storage.get('AccountName');
        }
        else {
            //console.log("Globals-Service - sending assigned Account Name")
            return this.AccountName;
        }
    }

    public getAccountNamePromise ()  {
        return this.storage.get("AccountName").then((token) => {
            this.AccountName = token;
        }); 
    }

    public Email: string = "";
    public Phone: string = "";
    public Language: string = "en";
    public freezeAlert: boolean = false;
    public continuesFlowAlert: boolean = false;
    public noFlowAlert: boolean = false;
    private translate: TranslateService;


    constructor ( 
      private storage: Storage,
                ) {
        console.log("Storage constructor");
        this.loadDataFromStorage();
        
    }

    public setStorageReady(myAppTranslate) {
        this.translate = myAppTranslate;
        this.loadDataFromStorage();
    }

    private loadDataFromStorage () {
        console.log("load data from storage function")

        
        this.storage.ready().then(() => {
          this.storage.get('AccountName').then((data) => { this.AccountName = data; });
          this.storage.get('Email').then((data) => { this.Email = data; });
          this.storage.get('Phone').then((data) => { this.Phone = data; });
          this.storage.get('freezeAlert').then((data) => { this.freezeAlert = data; });
          this.storage.get('continuesFlowAlert').then((data) => { this.continuesFlowAlert = data; });
          this.storage.get('noFlowAlert').then((data) => { this.noFlowAlert = data; });
          this.storage.get('Language').then((data) => {
            this.translate.use(data)
            this.Language = data
          });
    });

    }

    private storeLocalData (keyToStore, valueToStore) {
        this.storage.set(keyToStore, valueToStore);
    }

    public storeData() {
        this.storeLocalData ("AccountName",this.AccountName);
        this.storeLocalData("Email",this.Email);
        this.storeLocalData("Phone",this.Phone);
        this.storeLocalData("freezeAlert",this.freezeAlert);
        this.storeLocalData("continuesFlowAlert",this.continuesFlowAlert);
        this.storeLocalData("noFlowAlert", this.noFlowAlert);
        this.storeLocalData("Language", this.Language);
        this.translate.use(this.Language)


      }

}




