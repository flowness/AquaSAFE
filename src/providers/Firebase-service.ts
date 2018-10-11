import { Injectable } from "@angular/core";
import { GlobalsService } from "./Globals-service";
import { FCM } from '@ionic-native/fcm';
import { Platform, ToastController } from "ionic-angular";
//import { DeviceService } from '../providers/Device-service';
import { AsyncJSONService } from "../providers/Async-JSON-service";
import { Device } from '@ionic-native/device';

@Injectable()
export class FirebaseService {

    private registerPushDeviceURL: string = "https://yg8rvhiiq0.execute-api.eu-west-1.amazonaws.com/poc/register";
    private accountName: string = "";

    private token = "";
    public getToken () {
        this.platform.ready().then(() => {
            return this.token;
        });
    }

    constructor (   
                    private platform : Platform,                  
                    private globalsService : GlobalsService,
                    private toastCtrl: ToastController,
                    private device : Device,
                    private fcm : FCM,
                    private asyncJSONService: AsyncJSONService
                ) {
                    console.log("constructor Firebasde-service");

                    this.globalsService.getAccountName().then((account) => { 
                        this.accountName = account; 
                    });
        
    }
    
    private registerTokenToDB () {

        Promise.all ([  this.platform.ready(),
                        this.globalsService.getAccountNamePromise(),
        ]).then(() => {


/*
        this.platform.ready().then(() => {
            this.globalsService.getAccountNamePromise().then(() => {
                this.deviceService.getCordova().subscribe(data: string) => {
            
*/
                    let instanceID = this.token.substring(0,this.token.indexOf(":"));

                    if (this.accountName == "") {
                        console.log ("Firebase service - Account Name is NOT ready, try again");
                        this.globalsService.getAccountName().then((account) => { 
                            this.accountName = account; 
                        });
                    }


                    // store Token in database
                    console.log("Device details:");
                    console.log("OS = " + this.device.platform);
                    console.log("osVersion = " + this.device.version);
                    console.log("model = " + this.device.model);
                    console.log("token = " + this.token);
                    console.log("instanceID = " + instanceID);
                    console.log("moduleSN = " + this.accountName);
                    let deviceDetails = {
                                        "os": this.device.platform,
                                        "osVersion": this.device.version,
                                        "model":this.device.model,
                                        "instanceId": instanceID,
                                        "token": this.token,
                                        "moduleSN": this.accountName   }                       
                    
                    console.log ("deviceDetails = " + deviceDetails);

                    this.asyncJSONService.postJSONDataAsync(this.registerPushDeviceURL, deviceDetails).then(data => {
                        if (
                            data != undefined &&
                            data["statusCode"] != undefined &&
                            data["statusCode"] == 200
                            ) {
                                console.log("Registered new push device");
                                
                        }    
                        else {
                            console.log("Error registering push device");
                        }
                        console.log("data.body = " + data.body);
                    });
           //     });
           // });        
        });
    }

    public setFirebaseConfigurations () {
        this.platform.ready().then(() => {
            //Notifications
            //this.fcm.subscribeToTopic('all');
            //this.fcm.unsubscribeFromTopic('all');

            this.fcm.getToken().then(token=>{

                this.token = token;
                console.log("token recieved = " + token);
                this.registerTokenToDB();
            })
            this.fcm.onNotification().subscribe(data=>{
                if(data.wasTapped){
                    console.log("Received in background");
                        // show a toast
                        const toast = this.toastCtrl.create({
                        message: data.body,
                        duration: 3000
                        });
                        toast.present();
                } else {
                    console.log("Received in foreground");
                    const toast = this.toastCtrl.create({
                        message: data.body,
                        duration: 3000
                    });
                    toast.present();
                };
            });
            this.fcm.onTokenRefresh().subscribe(token=>{
                this.token = token;
                console.log("token refreshed" + token);
                this.registerTokenToDB();
            });
        });


    }
}
    /*
    this.fcm.subscribeToTopic('marketing');

    this.fcm.getToken().then(token => {
    backend.registerToken(token);
    });

    this.fcm.onNotification().subscribe(data => {
    if(data.wasTapped){
        console.log("Received in background");
    } else {
        console.log("Received in foreground");
    };
    });

    this.fcm.onTokenRefresh().subscribe(token => {
    backend.registerToken(token);
    });

    this.fcm.unsubscribeFromTopic('marketing');
    */

