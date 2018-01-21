export class ShiftingDivModel{
    canShift:boolean
    canShiftHorizontal:boolean;
    canShiftVertical:boolean;
    rightCtrl:boolean;
    leftCtrl:boolean;
    bottomCtrl:boolean;
    topCtrl:boolean;
    scaleRatio:number;

    constructor(){
        this.scaleRatio = 1;
    }
}