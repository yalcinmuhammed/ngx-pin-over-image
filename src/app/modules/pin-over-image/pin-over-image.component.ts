import { Component, ViewChild, Input, Output, ReflectiveInjector, EventEmitter,  ViewContainerRef, ElementRef, OnInit, ComponentFactoryResolver} from '@angular/core';

//models
import { PointModel } from './models/point.model';
import { PinModel } from './models/pin.model';
import { ShiftingDivModel } from './models/shiftingDiv.model';


@Component({
  selector: 'pin-over-image',
  templateUrl: './pin-over-image.component.html',
  styleUrls: ['./pin-over-image.component.css']
})
export class PinOverImageComponent implements OnInit {

  urlImage:string="https://busraabaci.files.wordpress.com/2015/04/doga-2.jpg";
  tmpImg: HTMLImageElement; // will be used to load the actual image before showing it

  pinRadius:number = 10;


  @ViewChild('outerDiv') outerDivRef:ElementRef;
  outerDiv:HTMLDivElement;

  @ViewChild('innerDiv') innerDivRef:ElementRef;
  innerDiv:HTMLDivElement;

  @ViewChild('progressImg') progressImgRef:ElementRef;
  progressImg:HTMLImageElement;

  shiftingDiv:ShiftingDivModel = new ShiftingDivModel();
  currentMousePoint:PointModel = new PointModel();

  shiftingPin:PinModel = null;

  pinList:PinModel[] = [];

  constructor() {
    
  }

  intialize(){
    //outer div
    this.outerDiv.style.width = 600 +"px";
    this.outerDiv.style.height = 500 +"px";

    //progress div
    this.progressImg.width=50;
    this.progressImg.height=50;
    this.progressImg.src = 'http://www.downgraf.com/wp-content/uploads/2014/09/01-progress.gif';
    
    this.onLoadImage();
    
  }

  fillPinList(){
    let pin1 = new PinModel();
    pin1.id = 1;
    pin1.width=20;
    pin1.height=20;
    pin1.borderRadius = 10;
    pin1.radius=10;
    pin1.background="url(https://cdn4.iconfinder.com/data/icons/iconsimple-places/512/pin_1-128.png)";
    //pin1.background="red";
    let p1:PointModel = new PointModel();
    p1.left = 100;
    p1.top = 100;
    pin1.point = p1;
    this.pinList.push(pin1);
    console.log("this.pinList: ",this.pinList);
  }

  ngOnInit() {
    this.outerDiv     = this.outerDivRef.nativeElement;
    this.innerDiv     = this.innerDivRef.nativeElement;
    this.progressImg  = this.progressImgRef.nativeElement;
    this.intialize();
  }
  
  onLoadImage():void{
    let loaded = () => { // wait for image to load then replace it with loadingGIF
      this.progressImg.style.visibility = "hidden";
      this.innerDiv.style.backgroundImage = "url("+this.urlImage+")";
      this.innerDiv.style.width = this.tmpImg.width+"px";
      this.innerDiv.style.height = this.tmpImg.height+"px";
      this.centerInnerDiv();
      this.fillPinList();
    }
    
    // background loading logic
    if(this.tmpImg){
      this.tmpImg.onload = null; // remove the previous onload event, if registered
    }
    this.tmpImg = new Image();
    this.tmpImg.onload = loaded;  // register the onload event
    this.tmpImg.src = this.urlImage;
  }

  centerInnerDiv(){
    this.innerDiv.style.top = ((this.outerDiv.clientHeight - this.innerDiv.clientHeight)/2) +"px";
    this.innerDiv.style.left = ((this.outerDiv.clientWidth - this.innerDiv.clientWidth)/2) +"px";
  }

  getMousePos(div:HTMLDivElement, event:MouseEvent, pinRadius?:number):PointModel {
    let rect = div.getBoundingClientRect();
    if(pinRadius){
      return new PointModel(event.clientX - rect.left-pinRadius, event.clientY - rect.top-pinRadius);
    }
    return new PointModel(event.clientX, event.clientY);
}
  
  onMouseDownInnerDiv(event:MouseEvent){
    this.innerDiv.style.cursor = "move";
    this.currentMousePoint = this.getMousePos(this.outerDiv, event);
    this.shiftingDiv.canShift = true;
    if(this.outerDiv.clientWidth < this.innerDiv.clientWidth){
        this.shiftingDiv.canShiftHorizontal = true;            
    }
    if(this.outerDiv.clientHeight < this.innerDiv.clientHeight){
        this.shiftingDiv.canShiftVertical = true;
    }
  }

  onMouseMoveInnerDiv(event:MouseEvent):void{
    if(this.shiftingPin){
        let point:PointModel = this.getMousePos(this.innerDiv, event, this.pinRadius);
        if(point.left >= 0 && point.left <= this.innerDiv.clientWidth-2*this.pinRadius)
            this.shiftingPin.point.left = point.left;
        if(point.top >= 0 && point.top <= this.innerDiv.clientHeight-2*this.pinRadius)
            this.shiftingPin.point.top  = point.top;
    }
    else if(this.shiftingDiv.canShift){   
        if(this.shiftingDiv.canShiftHorizontal){
            if(this.outerDiv.clientWidth - this.innerDiv.clientWidth < this.innerDiv.offsetLeft){
                this.shiftingDiv.rightCtrl = true;
            }
            else{
                this.shiftingDiv.rightCtrl = false;
                this.innerDiv.style.left   = (this.outerDiv.clientWidth - this.innerDiv.clientWidth) + "px";
            }

            if(this.innerDiv.offsetLeft < 0){
                this.shiftingDiv.leftCtrl = true;
            }
            else{
                this.shiftingDiv.leftCtrl = false;
                this.innerDiv.style.left  = 0+"px";
            }
        }
        if(this.shiftingDiv.canShiftVertical){
            if(this.outerDiv.clientHeight - this.innerDiv.clientHeight < this.innerDiv.offsetTop){
                this.shiftingDiv.bottomCtrl = true;
            }
            else{
                this.shiftingDiv.bottomCtrl = false;
                this.innerDiv.style.top = (this.outerDiv.clientHeight - this.innerDiv.clientHeight) + "px";
            }
            
            if(this.innerDiv.offsetTop < 0){
                this.shiftingDiv.topCtrl = true;
            }
            else{
                this.shiftingDiv.topCtrl = false;
                this.innerDiv.style.top = 0+"px";
            }
        }

        let lastMousePoint:PointModel = this.currentMousePoint;
        this.currentMousePoint        = this.getMousePos(this.outerDiv, event);
        let diffPoint:PointModel      = this.currentMousePoint.subtraction(lastMousePoint);
        if(this.shiftingDiv.canShiftHorizontal){
            if(this.shiftingDiv.rightCtrl && diffPoint.left < 0){
                this.innerDiv.style.left = (this.innerDiv.offsetLeft + diffPoint.left)+"px";
            }
            if(this.shiftingDiv.leftCtrl && diffPoint.left > 0){
                this.innerDiv.style.left = (this.innerDiv.offsetLeft + diffPoint.left)+"px";
            }
        }
        if(this.shiftingDiv.canShiftVertical){
            if(this.shiftingDiv.bottomCtrl && diffPoint.top < 0){
                this.innerDiv.style.top = (this.innerDiv.offsetTop + diffPoint.top)+"px";
            }
            if(this.shiftingDiv.topCtrl && diffPoint.top > 0){
                this.innerDiv.style.top = (this.innerDiv.offsetTop + diffPoint.top)+"px";
            }
        }
        //this.innerDiv.style.left  = ((this.innerDiv.clientLeft - this.outerDiv.clientWidth/2 ) / this.innerDiv.clientWidth)+"px";
        //this.innerDiv.style.top   = ((this.innerDiv.clientTop - this.outerDiv.clientHeight/2 ) / this.innerDiv.clientHeight)+"px";
    }
  }

  onMouseUpInnerDiv(event:MouseEvent):void{
    this.innerDiv.style.cursor = "default";
    this.shiftingDiv.canShift = false;

    this.shiftingDiv.canShiftHorizontal = false;
    this.shiftingDiv.canShiftVertical = false;

    this.shiftingDiv.topCtrl     = false;
    this.shiftingDiv.bottomCtrl  = false;
    this.shiftingDiv.leftCtrl    = false;
    this.shiftingDiv.rightCtrl   = false;
  }

  onMouseLeaveInnerDiv(event:MouseEvent):void{
    this.innerDiv.style.cursor
    this.shiftingDiv.canShift = false;
  }

  mouseWheelUpFunc(event:MouseEvent){
    if(this.shiftingDiv.scaleRatio < 2){
      this.shiftingDiv.scaleRatio += 0.1;
      this.innerDiv.style.transform = "scale("+this.shiftingDiv.scaleRatio+")";
    }
  }

  mouseWheelDownFunc(event:MouseEvent){
    if(this.shiftingDiv.scaleRatio > 1){
      this.shiftingDiv.scaleRatio -= 0.1;
      this.innerDiv.style.transform = "scale("+this.shiftingDiv.scaleRatio+")";
    }
  }

  addPin(){
    console.log("double click");
  }

  /* HANDLE PIN MOUSE EVENTS*/
  handlePinMouseDown(pinModel:PinModel){
    this.shiftingPin = pinModel;
  }

  handlePinMouseUp(pinModel:PinModel){
    this.shiftingPin = null;
  }

  handlePinMouseMove(data:{pinModel:PinModel, event:MouseEvent}){
    if(this.shiftingPin){
        let point:PointModel = this.getMousePos(this.innerDiv, data.event, this.pinRadius);
        if(point.left >= 0 && point.left <= this.innerDiv.clientWidth-2*this.pinRadius){
            this.shiftingPin.point.left = point.left;
        }
        if(point.top >= 0 && point.top <= this.innerDiv.clientHeight-2*this.pinRadius){
            this.shiftingPin.point.top  = point.top;
        }
    }
  }

  handlePinMouseClick(pinModel:PinModel){
  }

  handlePinMouseLeave(pinModel:PinModel){
  }

}
