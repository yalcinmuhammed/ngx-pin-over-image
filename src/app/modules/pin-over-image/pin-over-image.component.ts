import { Component, ViewChild, Input, Output, ReflectiveInjector, EventEmitter,  ViewContainerRef, ElementRef, OnInit, ComponentFactoryResolver} from '@angular/core';

//models
import { PointModel } from './models/point.model';
import { PinModel } from './models/pin.model';
import { OptionModel } from './models/option.model';
import { ShiftingDivModel } from './models/shiftingDiv.model';


@Component({
  selector: 'pin-over-image',
  templateUrl: './pin-over-image.component.html',
  styleUrls: ['./pin-over-image.component.css']
})
export class PinOverImageComponent implements OnInit {

    isLoaded:boolean;
    options:OptionModel = null;
    pinList:PinModel[] = [];

    shiftingPin:PinModel = null;
    tmpImg: HTMLImageElement; // will be used to load the actual image before showing it


    @Input() set optionData(options:OptionModel) {
        this.options = options;
    }

    @Input() set pinListData(pinList:PinModel[]) {
        this.pinList = pinList;
    }
    
    @ViewChild('outerDiv') outerDivRef:ElementRef;
    outerDiv:HTMLDivElement;

    @ViewChild('innerDiv') innerDivRef:ElementRef;
    innerDiv:HTMLDivElement;

    @ViewChild('bottomDiv') bottomDivRef:ElementRef;
    bottomDiv:HTMLDivElement;

    @ViewChild('progressImg') progressImgRef:ElementRef;
    progressImg:HTMLImageElement;

    shiftingDiv:ShiftingDivModel = new ShiftingDivModel();
    currentMousePoint:PointModel = new PointModel();

    

    constructor() {
        
    }

    intialize(){
        

        //outer div
        this.outerDiv.style.width = this.options.outerDivWidth +"px";
        this.outerDiv.style.height = this.options.outerDivHeight +"px";

        //bottom div
        this.bottomDiv.style.top = this.options.outerDivHeight-30+"px";
        this.bottomDiv.style.width = this.options.outerDivWidth +"px";
        this.bottomDiv.style.height = 30 +"px";
        this.bottomDiv.style.background = this.options.bottomDivBackground;
        
        //progress img
        this.progressImg.style.backgroundImage="url("+this.options.progressImgSrc+")";


        this.onLoadImage();
        
    }

    ngOnInit() {
        this.outerDiv     = this.outerDivRef.nativeElement;
        this.innerDiv     = this.innerDivRef.nativeElement;
        this.bottomDiv    = this.bottomDivRef.nativeElement;
        this.progressImg  = this.progressImgRef.nativeElement;
        this.intialize();
    }
    
    onLoadImage():void{
        let loaded = () => { // wait for image to load then replace it with loadingGIF
            this.progressImg.style.visibility = "hidden";
            this.innerDiv.style.backgroundImage = "url("+this.options.imageUrl+")";
            this.innerDiv.style.width = this.tmpImg.width+"px";
            this.innerDiv.style.height = this.tmpImg.height+"px";
            this.isLoaded = true;
            this.centerInnerDiv();
        }
        
        // background loading logic
        if(this.tmpImg){
        this.tmpImg.onload = null; // remove the previous onload event, if registered
        }
        this.tmpImg = new Image();
        this.tmpImg.onload = loaded;  // register the onload event
        this.tmpImg.src = this.options.imageUrl;
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
            let point:PointModel = this.getMousePos(this.innerDiv, event, this.options.pinRadius);
            if(point.left >= 0 && point.left <= this.innerDiv.clientWidth-2*this.options.pinRadius)
                this.shiftingPin.point.left = point.left;
            if(point.top >= 0 && point.top <= this.innerDiv.clientHeight-2*this.options.pinRadius)
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

    zoomIn(){
        if(this.shiftingDiv.scaleRatio < 2){
            this.shiftingDiv.scaleRatio += 0.1;
            this.innerDiv.style.transform = "scale("+this.shiftingDiv.scaleRatio+")";
        }
    }

    zoomOut(){
        if(this.shiftingDiv.scaleRatio > 1){
            this.shiftingDiv.scaleRatio -= 0.1;
            this.innerDiv.style.transform = "scale("+this.shiftingDiv.scaleRatio+")";
        }
    }

    hideShowPins(){
        if(this.pinList.length > 0){
            switch(this.pinList[0].visibility){
                case "visible":
                    this.pinList.map(pinItem=>pinItem.visibility = "hidden");
                    break;
                case "hidden":
                default:
                    this.pinList.map(pinItem=>pinItem.visibility = "visible");
                    break;
            }
        }
    }

    addPin(){
        let newPin:PinModel = new PinModel();
        newPin.visibility="visible";
        newPin.point = new PointModel();
        if(this.innerDiv.clientWidth >= this.outerDiv.clientWidth){
            newPin.point.left = (this.outerDiv.clientWidth / 2 ) 
                + Math.abs(this.innerDiv.offsetLeft) - this.options.pinRadius;
        }else{
            newPin.point.left = (this.innerDiv.clientWidth / 2 ) - this.options.pinRadius;
        }
        if(this.innerDiv.clientHeight >= this.outerDiv.clientHeight){
            newPin.point.top = (this.outerDiv.clientHeight / 2 ) 
                + Math.abs(this.innerDiv.offsetTop) - this.options.pinRadius;
        }else{
            newPin.point.top = (this.innerDiv.clientHeight / 2 )  - this.options.pinRadius;
        }
        this.pinList.push(newPin);
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
            let point:PointModel = this.getMousePos(this.innerDiv, data.event, this.options.pinRadius);
            if(point.left >= 0 && point.left <= this.innerDiv.clientWidth-2*this.options.pinRadius){
                this.shiftingPin.point.left = point.left;
            }
            if(point.top >= 0 && point.top <= this.innerDiv.clientHeight-2*this.options.pinRadius){
                this.shiftingPin.point.top  = point.top;
            }
        }
    }

    handlePinMouseClick(pinModel:PinModel){
    }

    handlePinMouseLeave(pinModel:PinModel){
    }

    /* OUTER DIV MOUSE EVENTS */
    onMouseEnterOuterDiv(event:MouseEvent){
        this.bottomDiv.style.visibility = "visible";
    }

    onMouseLeaveOuterDiv(event:MouseEvent){
        this.bottomDiv.style.visibility = "hidden";
    }

}
