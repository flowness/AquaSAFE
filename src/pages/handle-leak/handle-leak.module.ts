import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HandleLeakPage } from './handle-leak';

@NgModule({
  declarations: [
    HandleLeakPage,
  ],
  imports: [
    IonicPageModule.forChild(HandleLeakPage),
  ],
})
export class HandleLeakPageModule {}
