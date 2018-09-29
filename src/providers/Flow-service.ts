import { Injectable } from "@angular/core";
import { AsyncJSONService } from "./Async-JSON-service";


@Injectable()
export class FlowService {
                    private currentFlow = 0;
                    private intervalReceiveCurrentFlow;
                    private currentFlowUrl: string = "https://yg8rvhiiq0.execute-api.eu-west-1.amazonaws.com/poc/currentflow?moduleSN=azarhome";

    constructor (                     
                    private asyncJASONRequests: AsyncJSONService

                ) {
                this.intervalReceiveCurrentFlow = setInterval(() => { this.PollingCurrentFlow(); }, 1000);
                console.log("constructor Flow-service");
    }

    public getCurrentFlow() { return this.currentFlow; }
    public setCurrentFlow(newCurrentFlow: number){ this.currentFlow = newCurrentFlow; }

    private PollingCurrentFlow () {
      
        this.asyncJASONRequests.getJSONDataAsync(this.currentFlowUrl).then(
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
                        console.log(lastFlow);
                        this.currentFlow = lastFlow;

                        //this.chart.series[0].addPoint(flow, true, true);
                        //return flow;
                        
                        //this.modelService.setCurrentFlow(flow);
                        //this.chart.series[0].points[0].update(this.modelService.getCurrentFlow());

                    }
        );
      
    }


}