import { Injectable } from "@angular/core";
import { GlobalsService } from "./Globals-service";
import { FCM } from '@ionic-native/fcm';
import { Platform } from "ionic-angular";
import { DeviceService } from '../providers/Device-service';
import { AsyncJSONService } from "../providers/Async-JSON-service";

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
                    private deviceService: DeviceService,
                    private fcm : FCM,
                    private asyncJSONService: AsyncJSONService
                ) {
                    console.log("constructor Firebasde-service");

                    this.globalsService.getAccountName().then((account) => { 
                        this.accountName = account; 
                    });
        
    }
    
    private registerTokenToDB () {
        this.platform.ready().then(() => {
            this.globalsService.getAccountName1().then(() => {
                this.deviceService.deviceServiceReady().then(() => {
            
                    let instanceID = this.token.substring(1,this.token.indexOf(":"));


                    if (this.accountName == "") {
                        console.log ("Firebase service - Account Name is NOT ready, try again");
                        this.globalsService.getAccountName().then((account) => { 
                            this.accountName = account; 
                        });
                    }


                    // store Token in database
                    console.log("Ddevice details:");
                    console.log("OS = " + this.deviceService.getPlatform());
                    console.log("osVersion" + this.deviceService.getVersion());
                    console.log("model = " + this.deviceService.getModel());
                    console.log("token = " + this.token);
                    console.log("instanceID = " + instanceID);
                    console.log("moduleSN" + this.accountName);
                    let deviceDetails = {
                                        "os": this.deviceService.getPlatform(),
                                        "osVersion": this.deviceService.getVersion(),
                                        "model":this.deviceService.getModel(),
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
                                console.log("Registered new push device")
                        }    
                        else {
                            console.log("Error registering push device")
                            console.log("Data = " + data);
                        }
                    });
                });
            });        
        });
    }

    public setFirebaseConfigurations () {
        this.platform.ready().then(() => {
            //Notifications
            this.fcm.subscribeToTopic('all');
            this.fcm.getToken().then(token=>{
                
                this.token = token;
                console.log("token recieved = " + token);
                this.registerTokenToDB();
            })
            this.fcm.onNotification().subscribe(data=>{
            if(data.wasTapped){
                console.log("Received in background");
            } else {
                console.log("Received in foreground");
            };
            })
            this.fcm.onTokenRefresh().subscribe(token=>{
                this.token = token;
                console.log("token refreshed" + token);
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

