import { Injectable } from "@angular/core";
import { Device } from '@ionic-native/device';
import { Platform } from 'ionic-angular';


@Injectable()
export class DeviceService {

    constructor (                     
                    private platform : Platform,
                    private device: Device
                ) {
    }

    public deviceServiceReady () {
        return this.platform.ready().then(() => {

        });     
    }

    public getUUID() : any {
        return this.platform.ready().then(() => {
             this.device.uuid;
        });     
    }

    public getCordova() : any {
        return this.platform.ready().then(() => {
             this.device.cordova;
        });     
    }

    public getModel() : any {
        return this.platform.ready().then(() => {
            this.device.model;
        });     
    }

    public getVersion() : any {
        this.platform.ready().then(() => {
            return this.device.version;
        });     
    }

    public getSerial() : any {
        this.platform.ready().then(() => {
            return this.device.serial;
        });     
    }

    public getPlatform() : any {
        this.platform.ready().then(() => {
            return this.device.platform;
        });     
    }

    public getManufacturer() : any {
        this.platform.ready().then(() => {
            return this.device.manufacturer;
        });     
    }


/* 
    {
        "os": "iOS",
        "osVersion": "8",
        "model": "iPhone6",
        "instanceId": "123123",
        "token": "123123:sdfsdfsdfsfsdf",
        "moduleSN": "ABCDEF01"
      }

 */
}

