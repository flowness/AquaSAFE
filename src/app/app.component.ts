import { Component, ViewChild } from "@angular/core";
import { Nav, Platform, ToastController } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";

import { HomePage } from "../pages/home/home";
import { StatisticsPage } from "../pages/menu/statistics/statistics";
import { SettingsPage } from "../pages/menu/settings/settings";
import { EventsPage } from "../pages/menu/events/events";
import { ModelService } from "../providers/model-service";
import { FcmProvider } from "../providers/fcm/fcm";
import { tap } from "rxjs/operators";

@Component({
  templateUrl: "app.html"
})
export class MyApp {
  @ViewChild(Nav)
  nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{ title: string; component: any }>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public modelService: ModelService,
    fcm: FcmProvider,
    toastCtrl: ToastController
  ) {
    this.initializeApp();

    if (this.platform.is("cordova")) {
      platform.ready().then(() => {
        // Get a FCM token
        fcm.getToken();

        // Listen to incoming messages
        fcm
          .listenToNotifications()
          .pipe(
            tap(msg => {
              // show a toast
              const toast = toastCtrl.create({
                message: msg.body,
                duration: 3000
              });
              toast.present();
            })
          )
          .subscribe();
      });
    }
    // used for an example of ngFor and navigation
    this.pages = [
      { title: "Home", component: HomePage },
      { title: "Statistics", component: StatisticsPage },
      { title: "Settings", component: SettingsPage },
      { title: "Events", component: EventsPage }
    ];
  }

  initializeApp() {
    console.log("**************App Init**************");
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
