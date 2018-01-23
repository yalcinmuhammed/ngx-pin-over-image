import {Component, ViewChild, Output, Input, EventEmitter, ElementRef, OnInit } from '@angular/core';
//models
import { OptionModel } from './../models/option.model';
import { PinModel } from './../models/pin.model';
import { PointModel } from './../models/point.model';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'pin',
  templateUrl: './pin.component.html',
  styleUrls: ['./pin.component.css']
})
export class PinComponent implements OnInit {

  pinModel:PinModel = null;
  options:OptionModel = null;

  @Output() pinMouseDown  = new EventEmitter();
  @Output() pinMouseUp    = new EventEmitter();
  @Output() pinMouseMove  = new EventEmitter();
  @Output() pinMouseClick = new EventEmitter();
  @Output() pinMouseLeave = new EventEmitter();

  @Input() set pinData(pinModel:PinModel) {
    this.pinModel = pinModel;
  }

  @Input() set optionData(options:OptionModel) {
    this.options = options;
  }

  constructor(private domSanitizer:DomSanitizer) { 

  }

  ngOnInit() {

  }

  onMouseDown(event:MouseEvent):void{
    this.pinMouseDown.emit(this.pinModel);
  }

  onMouseUp(event:MouseEvent):void{
    this.pinMouseUp.emit(this.pinModel);
  }

  onMouseMove(event:MouseEvent):void{
    this.pinMouseMove.emit(
      {
        pinModel:this.pinModel,
        event: event
      });
  }

  onMouseLeave(event:MouseEvent):void{
    this.pinMouseLeave.emit(this.pinModel);
  }

  onClick(event:MouseEvent):void{
    this.pinMouseClick.emit(this.pinModel);
  }

}
