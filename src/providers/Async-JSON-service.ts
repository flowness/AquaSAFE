import { Injectable } from "@angular/core";
import { Http } from "@angular/http";

@Injectable()
export class AsyncJSONService {
    constructor( private http: Http ) {
        console.log("constructor Async-JSON-service");
    }
    
    public getJSONDataAsync(url: string): Promise<any> {
        return new Promise((resolve, reject) => {
        this.http.get(url).subscribe(res => {
            if (!res.ok) {
            reject(
                "Failed with status: " +
                res.status +
                "\nTrying to find fil at " +
                url
            );
            }
            resolve(res.json());
        });
        }).catch(reason => this.handleError(reason));
    }
    
    public postJSONDataAsync(url: string, body: any): Promise<any> {
        console.log ('Now at JSON Post async');
        return new Promise((resolve, reject) => {
          this.http.post(url, body).subscribe(res => {
            if (!res.ok) {
              console.log('@@@@ res not OK at post JSON async');
              reject(
                "Failed with status: " +
                res.status +
                "\nTrying to find file at " +
                url
              );
            }
            console.log ('res == ' + res);
            resolve(res.json());
          });
        }).catch(reason => this.handleError(reason));
      }
    

    /* Takes an error, logs it to the console, and throws it */
    public handleError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || "";
            const err = JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ""} ${err}`;
        } 
        else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
    }
}