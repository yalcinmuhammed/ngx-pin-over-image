import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

import { PinOverImageModule } from './modules/pin-over-image/pin-over-image.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    PinOverImageModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
