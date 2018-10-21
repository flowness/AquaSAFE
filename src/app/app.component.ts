import { Component, ViewChild } from "@angular/core";
import { Nav, Platform, ToastController } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";

import { GlobalsService} from "../providers/Globals-service"

import { HomePage2 } from "../pages/home.2/home2";

import { StatisticsPage } from "../pages/menu/statistics/statistics";
import { SettingsPage } from "../pages/menu/settings/settings";
import { EventsPage } from "../pages/menu/events/events";
import { ModelService } from "../providers/model-service";
//import { FcmProvider } from "../providers/fcm/fcm";
import { tap } from "rxjs/operators";
import { FirebaseService } from "../providers/Firebase-service";
import { TranslateService, LangChangeEvent  } from '@ngx-translate/core';

@Component({
  templateUrl: "app.html"
})
export class MyApp {
  @ViewChild(Nav)
  nav: Nav;

  rootPage: any = HomePage2;

  pages: Array<{ title: string; component: any }>;
  private accountName: string = "";

  constructor(    
    private globalsService: GlobalsService,
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public translate: TranslateService,

    toastCtrl: ToastController,
    private firebaseService : FirebaseService
  ) {
    this.initializeApp();

      this.translate.setDefaultLang('en');

      //this.translate.use('en');
      console.log("direction from app.components = " + platform.dir());


      this.translate.onLangChange.subscribe((event: LangChangeEvent) =>  {
          if(event.lang == 'he') {
            platform.setDir('ltr', false);
            platform.setDir('rtl', true);
            console.log("set direction to rtl - he");
          }
          else {
            platform.setDir('rtl', false);
            platform.setDir('ltr', true);
            console.log("set language to ltr - not he")
          }
        });

      globalsService.setStorageReady(translate);

      if (this.platform.is("cordova")) {
      platform.ready().then(() => {
        // Get a FCM token
        console.log("Getting Token");
        firebaseService.setFirebaseConfigurations();
        
/*
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
*/

      });
    }
    // used for an example of ngFor and navigation
      this.pages = [
      { title: "HOME_PAGE_MENU", component: HomePage2 },
      { title: "STATISTICS_PAGE_MENU", component: StatisticsPage },
      { title: "SETTINGS_PAGE_MENU", component: SettingsPage },
      { title: "EVENTS_PAGE_MENU", component: EventsPage }
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
