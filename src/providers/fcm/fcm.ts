import { Injectable } from "@angular/core";
import { Platform } from "ionic-angular";
import { Firebase } from "@ionic-native/firebase";
import { Observable } from "rxjs/Observable";

/*
  Generated class for the FcmProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FcmProvider {
  constructor(private platform: Platform, public firebaseNative: Firebase) {
    console.log("Hello FcmProvider Provider");
  }

  // Get permission from the user
  async getToken() {
    let token;

    if (this.platform.is('android')) {
      token = await this.firebaseNative.getToken()
    } 
  
    if (this.platform.is('ios')) {
      token = await this.firebaseNative.getToken();
      await this.firebaseNative.grantPermission();
    } 
    
    console.log("FCM token = " + token);
    // return this.saveTokenToFirestore(token)
  }

  // Save the token to firestore
  // private saveTokenToFirestore(token) {}

  // Listen to incoming FCM messages
  listenToNotifications(): Observable<any> {
    return this.firebaseNative.onNotificationOpen();
  }
}
