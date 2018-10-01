import { Injectable } from "@angular/core";
import { AsyncJSONService } from "./Async-JSON-service";

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
    private eventsUrl: string = "https://yg8rvhiiq0.execute-api.eu-west-1.amazonaws.com/poc/event?EventID=";
    private intervalReceiveStatusEvents;

    private globalSystemSeverity: GlobalSystemSeverityTypes;
    private statusEventList: SystemStatusEvent[] = [];
    private lastStatusEventID: number;

    public getGlobalSystemSeverity () {return this.globalSystemSeverity;}
    public setGlobalSystemSeverity (newSeverity: GlobalSystemSeverityTypes) {this.globalSystemSeverity = newSeverity;}

    public getEventList() { return this.statusEventList; }

    public getLastEventID () {return this.lastStatusEventID;}
    public setLastEventID (newEventID: number) { this.lastStatusEventID = newEventID;}

    constructor( private asyncJASONRequests: AsyncJSONService ) {
        this.globalSystemSeverity = GlobalSystemSeverityTypes.NORMAL;
        this.lastStatusEventID = -1;
        this.intervalReceiveStatusEvents = setInterval(() => { this.PollingStatusEvents(); }, 5000);
        console.log("constructor Event-service");
    }
    
    private PollingStatusEvents () {
        let curStatusURL = this.statusURL;
        curStatusURL += 'SN=' + 'azarhome';
        curStatusURL += '&';
        curStatusURL += 'statusType=' + 'All';
        curStatusURL += '&';
        if (this.lastStatusEventID == -1) {
            // No events received yet
            //console.log ('No event received yet');
            curStatusURL += 'period=' + '1' + ' ' + 'DAY';
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
                                //console.log('@@ DATA = ' + data.body);
                                
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
    }

    private GenerateGlobalSystemStatus(){
        let currentSystemSeverity = SeverityTypes.NORMAL;

        for (let index = 0; index < this.statusEventList.length; index++) { 
            
            if (this.statusEventList[index].severity == SeverityTypes.ALERT) 
                currentSystemSeverity = this.statusEventList[index].severity;
                break;
            if (this.statusEventList[index].severity == SeverityTypes.WARNING) 
                currentSystemSeverity = this.statusEventList[index].severity;
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
            Event_str: JSONStatusEvent.Event_str,
            total_flow: JSONStatusEvent.total_flow,
            parent_eventID: null,
            initiator: JSONStatusEvent.initiator,
            status: this.setStatusENUM(JSONStatusEvent.status), 
            severity: JSONStatusEvent.severity,
                    rollingSubEvents: []
        }
        this.statusEventList.push(newStatusEvent);
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
            if (this.statusEventList[index].status != Statuses.CLOSED)
                openEventCounter++;
        }
        return openEventCounter;
    }

    private PollingSubEvents(parenrEventID: number) {

    }

 
}