export class PointModel{
    left:number;
    top:number;

    constructor(left?:number, top?:number){
        this.left = left;
        this.top = top;
    }

    subtraction(_point:PointModel){
        return new PointModel(this.left-_point.left, this.top-_point.top);
    }

}