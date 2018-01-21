import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PinOverImageComponent } from './pin-over-image.component';
import { MouseWheelDirective } from './directives/mousewheel.directive';
import { PinComponent } from './pin/pin.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [PinOverImageComponent, MouseWheelDirective, PinComponent],
  exports: [
    PinOverImageComponent // <-- this!
  ]
})
export class PinOverImageModule { }
