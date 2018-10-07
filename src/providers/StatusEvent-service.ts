import { Injectable } from "@angular/core";
import { AsyncJSONService } from "./Async-JSON-service";
import { GlobalsService} from "./Globals-service";

export enum GlobalSystemSeverityTypes{
    ALERT = 1, WARNING = 2, NORMAL = 3
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
    status: Statuses, 
    severity: SeverityTypes,
    rollingSubEvents: SystemStatusEvent[]
}

@Injectable()
export class StatusEventService {
    private statusURL: string = "https://yg8rvhiiq0.execute-api.eu-west-1.amazonaws.com/poc/status?";
    private subEventsUrl: string = "https://yg8rvhiiq0.execute-api.eu-west-1.amazonaws.com/poc/event?parentEventID=";
    private postNewEventsUrl: string = "https://yg8rvhiiq0.execute-api.eu-west-1.amazonaws.com/poc/event";
    private accountName: string = "";

    private intervalReceiveStatusEvents;
    private intervalReceiveSubEvents;

    private globalSystemSeverity: GlobalSystemSeverityTypes;
    private statusEventList: SystemStatusEvent[] = [];
    private lastStatusEventID: number;

    public getGlobalSystemSeverity () {return this.globalSystemSeverity;}
    public setGlobalSystemSeverity (newSeverity: GlobalSystemSeverityTypes) {this.globalSystemSeverity = newSeverity;}

    public getEventList() { return this.statusEventList; }

    public getLastEventID () {return this.lastStatusEventID;}
    public setLastEventID (newEventID: number) { this.lastStatusEventID = newEventID;}

    public isLiveEvent(statusEvent: SystemStatusEvent): boolean { 
        return statusEvent.status == Statuses.LIVE;
      }
    
    public isOpenEvent(statusEvent: SystemStatusEvent): boolean {
        return statusEvent.status != Statuses.CLOSED;
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
        this.globalSystemSeverity = GlobalSystemSeverityTypes.NORMAL;
        this.lastStatusEventID = -1;
        this.PollingStatusEvents();
        this.intervalReceiveStatusEvents = setInterval(() => { this.PollingStatusEvents(); }, 5000);
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
                                for (let index = 0; index < data.body.length; index++) { 
                                    //console.log('data[index] = ' + data.body[index] );                             
                                    this.pushNewStatusEvent(JSON.parse(data.body[index]));
                                }
                                if (data.body.length > 0) {
                                    this.lastStatusEventID = data.body[data.body.length - 1].idsystem_status;
                                    this.GenerateGlobalSystemStatus();
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
                                for (let index = 0; index < data.body.length; index++) { 
                                    //console.log('data[index] = ' + data.body[index] );                             
                                    this.checkUpdateOnCurrentStatuEvent(JSON.parse(data.body[index]));
                                }
                                this.GenerateGlobalSystemStatus();
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

    private GenerateGlobalSystemStatus(){
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
    }

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
            status: this.setStatusENUM(JSONStatusEvent.status), 
            severity: JSONStatusEvent.severity,
            rollingSubEvents: []
        }
        this.statusEventList.push(newStatusEvent);
        this.PollingSubEventsPerSystemStatus(this.statusEventList[this.statusEventList.length-1]);

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

    public closeStatusEvent (idsystem_status: number, closeDescription: string) {
        console.log('Cosing event at status service');
        this.postEventToParent (idsystem_status, closeDescription, true, Statuses.CLOSED);
    }

    public postEventToParent (idsystem_status: number, 
                            description: string, 
                            setNewStatus:boolean, 
                            newStatus: Statuses = Statuses.CLOSED) {
        let parentEventID = this.statusEventList[this.getSystemStatusEventIndexByID(idsystem_status)].event_ID;
        let postEventData : any = { 
                    eventSTR: description,
                    eventAge: "Existing",
                    systemStatus: setNewStatus == true ? "SetStatus" : "Existing",
                    newSystemStatus: newStatus,
                    SN: this.accountName,
                    parent_eventID: parentEventID 
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
            status: this.setStatusENUM(JSONStatusEvent.status), 
            severity: JSONStatusEvent.severity,
            rollingSubEvents: []
        }
        let statusEventIndex = this.getSystemStatusEventIndexByID(statusEventID);
        if (statusEventIndex != -1)
            this.statusEventList[statusEventIndex].rollingSubEvents.push(newSubsEvent);
    }    
}