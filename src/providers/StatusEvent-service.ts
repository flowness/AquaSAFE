import { Injectable } from "@angular/core";
import { AsyncJSONService } from "./Async-JSON-service";
import { GlobalsService} from "./Globals-service";
import { IsALeakPage } from "../pages/events/isaleak/isaleak";
import { resolveDefinition } from "@angular/core/src/view/util";

export enum GlobalSystemSeverityTypes{
    ALERT = 1, WARNING = 2, NORMAL = 3, UNKNOWN = 4
}

export enum SeverityTypes {
    ALERT = 1, WARNING = 2, NORMAL = 3
}

export enum Statuses {
    LIVE = 1, CLOSED = 2, POST = 3, COLD = 4
}

export interface SystemStatusEvent {
    idsystem_status: number,
    timestamp: string,
    epoch_timestamp: number,
    cooldown: number,
    event_ID: number,
    last_eventID: number,
    Event_str: string,
    total_flow: number,
    parent_eventID: number,
    initiator: string,
    isLeak: string,
    realUsage: string,
    S3Link: string,
    status: Statuses, 
    severity: SeverityTypes,
    rollingSubEvents: SystemStatusEvent[]
}

@Injectable()
export class StatusEventService {
    private statusURL: string = "https://yg8rvhiiq0.execute-api.eu-west-1.amazonaws.com/poc/status?";
    private subEventsUrl: string = "https://yg8rvhiiq0.execute-api.eu-west-1.amazonaws.com/poc/event?parentEventID=";
    private postNewEventsUrl: string = "https://yg8rvhiiq0.execute-api.eu-west-1.amazonaws.com/poc/event";
    private getImageByLinkURL = "https://yg8rvhiiq0.execute-api.eu-west-1.amazonaws.com/poc/image?imageLink=";
    private accountName: string = "";

    private intervalReceiveStatusEvents;
    private intervalReceiveSubEvents;

    private globalSystemSeverity: GlobalSystemSeverityTypes = GlobalSystemSeverityTypes.NORMAL;
    private statusEventList: SystemStatusEvent[] = [];
    private lastStatusEventID: number;

    public getGlobalSystemSeverity () {return this.globalSystemSeverity;}
    public setGlobalSystemSeverity (newSeverity: GlobalSystemSeverityTypes) {this.globalSystemSeverity = newSeverity;}

    public getEventList() { return this.statusEventList; }

    public getLastEventID () {return this.lastStatusEventID;}
    public setLastEventID (newEventID: number) { this.lastStatusEventID = newEventID;}

    public isLiveEventInSystem(): boolean {
        if (this.globalSystemSeverity == GlobalSystemSeverityTypes.ALERT)
            return true;
        else
            return false;

/*       if (this.statusEventList.length == 0)
        return null;
      for (let i = 0; i < this.statusEventList.length; i++) {
        if (this.statusEventList[i].status == Statuses.LIVE)
          return true;
      }
      return false; */

    }

    public getLiveEventID(): number {
      for (let i = 0; i < this.statusEventList.length; i++) {
        if (this.statusEventList[i].status == Statuses.LIVE)
          return this.statusEventList[i].idsystem_status;
      }
      return -1;
    }

    public getLiveEventTotalFlow(): number {
      for (let i = 0; i < this.statusEventList.length; i++) {
        if (this.statusEventList[i].status == Statuses.LIVE)
          return Math.round(this.statusEventList[i].total_flow/1000);
      }
      return -1;
    }

  public getLiveEventStartTime(): string {
    var timeoptions = { hourCycle: 'h24', year: '2-digit', month: '2-digit', day: '2-digit', hour: 'numeric', minute: '2-digit' };

      for (let i = 0; i < this.statusEventList.length; i++) {
        if (this.statusEventList[i].status == Statuses.LIVE)
          return new Date(this.statusEventList[i].epoch_timestamp).toLocaleDateString(this.globalsService.Language, timeoptions)
      }
      return "";
    }
    
    public isOpenEvent(statusEvent: SystemStatusEvent): boolean {
        return statusEvent.status != Statuses.CLOSED;
      }

    public isLiveEvent(statusEvent: SystemStatusEvent): boolean {
        return statusEvent.status == Statuses.LIVE;
    }


    public getSystemStatusEventIndexByID (statusEventID: number){
        for (let i = 0; i < this.statusEventList.length; i++) { 
            if (this.statusEventList[i].idsystem_status == statusEventID)
                return i
        }
        return -1;
    }

    constructor( private asyncJASONRequests: AsyncJSONService,
                 private globalsService: GlobalsService ) {
        this.globalSystemSeverity = GlobalSystemSeverityTypes.UNKNOWN;
        this.lastStatusEventID = -1;
        this.PollingStatusEvents();
        this.intervalReceiveStatusEvents = setInterval(() => { this.PollingStatusEvents(); }, 1000);
        //this.intervalReceiveSubEvents = setInterval(() => { this.PollingSubEvents(); }, 10000);
        console.log("constructor Event-service");
    }
    
    private PollingStatusEvents () {
        let curStatusURL = this.statusURL;

        this.globalsService.getAccountName().then((account) => { 
            this.accountName = account; 
          });

        if (this.accountName == "") {
            console.log ("Status service - Account Name is NOT ready");
            return;
        }
        curStatusURL += 'SN=' + this.accountName;
        curStatusURL += '&';
        curStatusURL += 'statusType=' + 'All';
        curStatusURL += '&';
        if (this.lastStatusEventID == -1) {
            // No events received yet
            //console.log ('No event received yet');
            curStatusURL += 'period=' + '7' + ' ' + 'DAY';
        }
        else {
            // Fetching only new events
            //console.log ('By latest')
            curStatusURL += 'period=' + 'Latest';
            curStatusURL += '&';
            curStatusURL += 'lastEventID=' + this.lastStatusEventID;
        }

            this.asyncJASONRequests.getJSONDataAsync(curStatusURL).then(
                data => {
                            //console.log('curStatusURL = ' + curStatusURL);
                            let lastFlow: number = 0;
                            if (
                                    data != undefined &&
                                    data["statusCode"] != undefined &&
                                    data["statusCode"] == 200 &&
                                    data.body != undefined &&
                                    data.body != null
                                ) {  
                            for (let index = data.body.length-1; index >= 0 ; index--) { 
                                        //console.log('data[index] = ' + data.body[index] );                             
                                        this.pushNewStatusEvent(JSON.parse(data.body[index]));
                                    }
                            if (data.body.length > 0) {
                                this.lastStatusEventID = JSON.parse(data.body[0]).idsystem_status;
                                if (JSON.parse(data.body[0]).liveEvent == 1)
                                    this.setGlobalSystemSeverity(GlobalSystemSeverityTypes.ALERT);
                                else
                                    this.setGlobalSystemSeverity(GlobalSystemSeverityTypes.NORMAL);
                                //this.GenerateGlobalSystemStatus();
                            }
                            }
                        }        
            );      


        let currentStatusIDs = '';
        for (let i = 0; i < this.statusEventList.length; i++) {
            currentStatusIDs = currentStatusIDs + this.statusEventList[i].idsystem_status;
            if (i < this.statusEventList.length - 1)
                currentStatusIDs = currentStatusIDs + ',';
        }
        
        curStatusURL = this.statusURL;
        curStatusURL += 'SN=' + this.accountName;
        curStatusURL += '&';
        curStatusURL += 'statusType=' + 'All';
        curStatusURL += '&';
        curStatusURL += 'period=' + 'Current';
        curStatusURL += '&';
        curStatusURL += 'currentIDs=' + currentStatusIDs;
        
        this.asyncJASONRequests.getJSONDataAsync(curStatusURL).then(
            data => {
                        //console.log('curStatusURL = ' + curStatusURL);
                        let lastFlow: number = 0;
                        if (
                                data != undefined &&
                                data["statusCode"] != undefined &&
                                data["statusCode"] == 200 &&
                                data.body != undefined &&
                                data.body != null
                            ) {  
                                if (data.body.length > 0)
                                    if (JSON.parse(data.body[0]).liveEvent == 1)
                                        this.setGlobalSystemSeverity(GlobalSystemSeverityTypes.ALERT);
                                    else
                                        this.setGlobalSystemSeverity(GlobalSystemSeverityTypes.NORMAL);
                                for (let index = 0; index < data.body.length; index++) { 
                                    //console.log('data[index] = ' + data.body[index] );                             
                                    this.checkUpdateOnCurrentStatuEvent(JSON.parse(data.body[index]));
                                }
                                //this.GenerateGlobalSystemStatus();
                        }
                    }        
        );      
    }

    private checkUpdateOnCurrentStatuEvent (JSONStatusEvent: any) {
        let curidsystem_status = JSONStatusEvent.idsystem_status;        
        let curIndex = this.getSystemStatusEventIndexByID(curidsystem_status);
        let curSystemStatusEvent = this.statusEventList[curIndex];

        let curLast_eventID = JSONStatusEvent.last_eventID;
        let curStatus = this.setStatusENUM(JSONStatusEvent.status);

        if (curSystemStatusEvent.status != curStatus)
            this.statusEventList[curIndex].status = curStatus;
        if (curSystemStatusEvent.last_eventID != curLast_eventID)
            this.PollingSubEventsPerSystemStatus(curSystemStatusEvent);
    }

/*     private GenerateGlobalSystemStatus(){
        let currentSystemSeverity = SeverityTypes.NORMAL;

        for (let index = 0; index < this.statusEventList.length; index++) { 
            if (this.statusEventList[index].status == Statuses.LIVE)
            {
                if (this.statusEventList[index].severity == SeverityTypes.ALERT) {
                    currentSystemSeverity = this.statusEventList[index].severity;
                    break;
                }
                if (this.statusEventList[index].severity == SeverityTypes.WARNING) 
                    currentSystemSeverity = this.statusEventList[index].severity;
            }  
        }

        switch (currentSystemSeverity) {
            case (SeverityTypes.NORMAL): 
                this.globalSystemSeverity = GlobalSystemSeverityTypes.NORMAL; break;
            case (SeverityTypes.WARNING):
                this.globalSystemSeverity = GlobalSystemSeverityTypes.WARNING; break;
            case (SeverityTypes.ALERT):
                this.globalSystemSeverity = GlobalSystemSeverityTypes.ALERT; break;

        }
    } */

    private pushNewStatusEvent (JSONStatusEvent: any) {
        let newStatusEvent: SystemStatusEvent = {
            idsystem_status: JSONStatusEvent.idsystem_status,
            timestamp: JSONStatusEvent.timestamp,
            epoch_timestamp: JSONStatusEvent.epoch_timestamp,
            cooldown: JSONStatusEvent.cooldown,
            event_ID: JSONStatusEvent.event_ID,
            last_eventID: JSONStatusEvent.last_eventID,
            Event_str: JSONStatusEvent.Event_str,
            total_flow: JSONStatusEvent.total_flow,
            parent_eventID: null,
            initiator: JSONStatusEvent.initiator,
            isLeak: JSONStatusEvent.isALeak,
            realUsage: JSONStatusEvent.waterUsage,
            S3Link: JSONStatusEvent.external_link,
            status: this.setStatusENUM(JSONStatusEvent.status), 
            severity: JSONStatusEvent.severity,
            rollingSubEvents: []
        }
        this.statusEventList.unshift(newStatusEvent);
        this.PollingSubEventsPerSystemStatus(this.statusEventList[0]);

    }

    private setStatusENUM (intStatus: number) {
        switch (intStatus){
            case (1) : return Statuses.LIVE;
            case (2) : return Statuses.CLOSED;
            case (3) : return Statuses.POST;
            case (4) : return Statuses.COLD;
        }

    }

    public getCountOpenStatusEvents () {
        let openEventCounter = 0;
        for (let index = 0; index < this.statusEventList.length; index++) { 
            if (this.statusEventList[index].status != Statuses.CLOSED) {
                openEventCounter++;
            }
        }
        return openEventCounter;
    }

    public getEventPictureByLink (imageS3Link) {

        let curGetImageByLinkURL = this.getImageByLinkURL + imageS3Link;
        return this.asyncJASONRequests.getJSONDataAsync(curGetImageByLinkURL).then(
            data => {
                        //console.log('curStatusURL = ' + curStatusURL);
                        let lastFlow: number = 0;
                        if (
                                data != undefined &&
                                data["statusCode"] != undefined &&
                                data["statusCode"] == 200 &&
                                data.body != undefined &&
                                data.body != null
                            ) {  
                          
                           return data.body;
                        }
                    }        
        );      



    }

    public closeStatusEvent (idsystem_status: number, closeDescription: string, isLeak: string = "",classUsage : string = "") {
        console.log('Closing event at status event service');
        this.postEventToParent (idsystem_status, closeDescription, true, Statuses.CLOSED, isLeak, classUsage);
    }

    public addPictureEvent (idsystem_status: number, base64Image: string) {
        console.log('Add image event at status event service');
        this.postEventToParent (idsystem_status, "", false, 0, "", "", base64Image);
    }
    
    public postEventToParent (idsystem_status: number, 
                            description: string, 
                            setNewStatus:boolean, 
                            newStatus: Statuses = -1,
                            isLeak: string = "",
                            classUsage: string = "",
                            image64Base: string = "") {
        let parentEventID = this.statusEventList[this.getSystemStatusEventIndexByID(idsystem_status)].event_ID;
        let postEventData : any = { 
                    eventSTR: description,
                    eventAge: "Existing",
                    systemStatus: setNewStatus == true ? "SetStatus" : "Existing",
                    newSystemStatus: newStatus,
                    SN: this.accountName,
                    parent_eventID: parentEventID,
                    isALeak: isLeak,
                    waterUsage: classUsage,
                    image: image64Base
                    }

        //console.log('data = ' + JSON.parse(postEventData));
        this.asyncJASONRequests.postJSONDataAsync(this.postNewEventsUrl, postEventData).then(data => {
          
           if (
            data != undefined &&
            data["statusCode"] != undefined &&
            data["statusCode"] == 200 )
            { console.log('post event returned data = ' + data) }
           
        }); 
    }

    private PollingSubEvents () {
        for (let i = 0; i < this.statusEventList.length; i++) 
            this.PollingSubEventsPerSystemStatus(this.statusEventList[i]);
    }

    private PollingSubEventsPerSystemStatus (statusEvent: SystemStatusEvent) {
    let curSubEventsURL = this.subEventsUrl + statusEvent.event_ID;
        this.asyncJASONRequests.getJSONDataAsync(curSubEventsURL).then(data => {
          if (
            data != undefined &&
            data["statusCode"] != undefined &&
            data["statusCode"] == 200
          ) {
            this.statusEventList[this.getSystemStatusEventIndexByID(statusEvent.idsystem_status)].rollingSubEvents = [];

            for (let index = 0; index < data.body.length; index++) { 
                //console.log('Sub event:  data[index] = ' + data.body[index] );                             
                this.pushNewSubEvent(statusEvent.idsystem_status, JSON.parse(data.body[index]));
            }
          }
        });
      }
    
      private pushNewSubEvent (statusEventID, JSONStatusEvent: any) {
        let newSubsEvent: SystemStatusEvent = {
            idsystem_status: JSONStatusEvent.idsystem_status,
            timestamp: JSONStatusEvent.timestamp,
            epoch_timestamp: JSONStatusEvent.epoch_timestamp,
            cooldown: JSONStatusEvent.cooldown,
            event_ID: JSONStatusEvent.event_ID,
            last_eventID: JSONStatusEvent.last_eventID,
            Event_str: JSONStatusEvent.Event_str,
            total_flow: JSONStatusEvent.total_flow,
            parent_eventID: null,
            initiator: JSONStatusEvent.initiator,
            isLeak: JSONStatusEvent.isALeak,
            realUsage: JSONStatusEvent.waterUsage,
            S3Link: JSONStatusEvent.external_link,
            status: this.setStatusENUM(JSONStatusEvent.status), 
            severity: JSONStatusEvent.severity,
            rollingSubEvents: []
        }
        let statusEventIndex = this.getSystemStatusEventIndexByID(statusEventID);
        if (statusEventIndex != -1)
            this.statusEventList[statusEventIndex].rollingSubEvents.push(newSubsEvent);
    }    
}
