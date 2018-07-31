import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlumbersPage } from './plumbers';

@NgModule({
  declarations: [
    PlumbersPage,
  ],
  imports: [
    IonicPageModule.forChild(PlumbersPage),
  ],
})
export class PlumbersPageModule {}
