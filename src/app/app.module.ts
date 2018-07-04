import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { MP100Page } from '../pages/mp100/mp100';
import { Fd100Page } from '../pages/fd100/fd100';
import { Vs100Page } from '../pages/vs100/vs100';
import { Bs100Page } from '../pages/bs100/bs100';
import { R100Page } from '../pages/r100/r100';
import { ModulePage } from '../pages/module/module';
import { ActionPage } from '../pages/action/action';
import { NotALeakPage } from '../pages/notaleak/notaleak';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    MP100Page,
    Fd100Page,
    Vs100Page,
    Bs100Page,
    R100Page,
    ModulePage,
    ActionPage,
    NotALeakPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    MP100Page,
    Fd100Page,
    Vs100Page,
    Bs100Page,
    R100Page,    
    ModulePage,
    ActionPage,
    NotALeakPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
