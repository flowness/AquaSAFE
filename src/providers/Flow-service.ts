import { Injectable } from "@angular/core";
import { AsyncJSONService } from "./Async-JSON-service";
import { GlobalsService } from "./Globals-service";


@Injectable()
export class FlowService {
                    private currentFlow = 0;
                    private intervalReceiveCurrentFlow;
                    private currentFlowUrl: string = "https://yg8rvhiiq0.execute-api.eu-west-1.amazonaws.com/poc/currentflow?moduleSN=";
                    private accountName: string = "";
    constructor (                     
                    private globalsService : GlobalsService,
                    private asyncJASONRequests: AsyncJSONService

                ) {
                this.intervalReceiveCurrentFlow = setInterval(() => { this.PollingCurrentFlow(); }, 1000);
                console.log("constructor Flow-service");

    }

    public getCurrentFlow() { return this.currentFlow; }
    public setCurrentFlow(newCurrentFlow: number){ this.currentFlow = newCurrentFlow; }

    private PollingCurrentFlow () {
        
        this.globalsService.getAccountName().then((account) => { 
            this.accountName = account; 
          });

        if (this.accountName == "") {
            console.log ("Flow service - Account Name is NOT ready");
            return;
        }

        this.asyncJASONRequests.getJSONDataAsync(this.currentFlowUrl + this.accountName).then(
            data => {
                        // console.log(data);
                        let lastFlow: number = 0;
                        if (
                                data != undefined &&
                                data["statusCode"] != undefined &&
                                data["statusCode"] == 200
                            ) {
                            lastFlow = data["body"]["Flow"];
                        }
                        //console.log(lastFlow);
                        this.currentFlow = lastFlow;
                    }
        );
      
    }


}