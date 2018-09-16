import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { asEvent, eventMoment } from '../../lib/interfaces';
import { EventStatus } from '../../lib/enums';
import { HandleLeakPage } from '../handle-leak/handle-leak';
import { EditEventPage } from '../edit-event/edit-event';
import { NotALeakPage } from '../events/notaleak/notaleak';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

/**
 * Generated class for the EventPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-event',
  templateUrl: 'event.html',
})
export class EventPage {
  asEvent: asEvent;
  momentsUrl: string = "https://yg8rvhiiq0.execute-api.eu-west-1.amazonaws.com/poc/event?EventID=";

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public http: Http) {
    this.asEvent = navParams.get('event');
    this.refreshMomentsData();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventPage');
  }

  private refreshMomentsData() {
    this.getJSONDataAsync(this.momentsUrl+this.asEvent.eventId).then(data => {
      // console.log(data);
      let moments: any[] = [];
      if (
        data != undefined &&
        data["statusCode"] != undefined &&
        data["statusCode"] == 200
      ) {
        moments = data["body"];
        this.setMomentsData(moments);
      }
      // console.log(events);
    });
  }

  /* Sets data with returned JSON array */
  private setMomentsData(data: any[]): void {
    for (let index = 0; index < data.length; index++) {
      // data[index].id = this.generateMockEventId();
      this.asEvent.moments.push(this.getMomentFromEvent(JSON.parse(data[index])));
    }
    // this.events = this.sortEvents(this.events, false);
    // console.log("events length2 = " + this.events.length);
  }

  private getMomentFromEvent(event: any): eventMoment {
    let moment: eventMoment = {
      title: event.Event_str,
      timestamp: event.timestamp,
      initiator: "aquasafe",
      comment: ""
    }
    // console.dir(event);
    return moment;
  }

  private getJSONDataAsync(url: string): Promise<any> {
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

  /* Takes an error, logs it to the console, and throws it */
  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || "";
      const err = JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ""} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

  isLiveEvent(e: asEvent): boolean {
    return e.status === EventStatus.LIVE;
  }

  handleAsEvent(e: asEvent): void {
    console.log("item type = " + e.status);
    if (e.status === EventStatus.LIVE) {
      this.navCtrl.push(HandleLeakPage, {
        event: e
      });
    } else {
      // alert("soon to be filled. status: " + e.status);
      this.openEditEventModal(e);
    }
  }

  handleNotALeak(e: asEvent): void {
    this.navCtrl.push(NotALeakPage, {
      event: e
    });
  }

  openEditEventModal(e: asEvent): void {
    let myModal = this.modalCtrl.create(EditEventPage, {
      event: e
    });
    myModal.present();
  }
}
