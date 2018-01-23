export class OptionModel{
    imageUrl:string;
    outerDivWidth:number;
    outerDivHeight:number;
    addPinIconUrl:string;
    hideShowIconUrl:string;
    zoomInIconUrl:string;
    zoomOutIconUrl:string;

    addPinText:string;
    hideShowText:string;
    zoomInText:string;
    zoomOutText:string;
    textColor:string;

    progressImgSrc:string;
    //pin proerties
    pinBackground:string;
    pinWidth:number;
    pinHeight:number;
    pinRadius:number;
    pinBorderRadius:number;

    bottomDivBackground:string;

    constructor(){
        
    }

    setBaseObject(data:any){
        this.imageUrl       = data.imageUrl;
        this.outerDivWidth  = data.outerDivWidth;
        this.outerDivHeight = data.outerDivHeight;
        this.addPinIconUrl  = data.addPinIconUrl;
        this.hideShowIconUrl= data.hideShowIconUrl;
        this.zoomInIconUrl  = data.zoomInIconUrl;
        this.zoomOutIconUrl = data.zoomOutIconUrl;
        this.progressImgSrc = data.progressImgSrc;
        this.pinBackground  = data.pinBackground;
        this.pinWidth       = data.pinWidth;
        this.pinHeight      = data.pinHeight;
        this.pinRadius      = data.pinRadius;
        this.pinBorderRadius= data.pinBorderRadius;
        this.addPinText     = data.addPinText;
        this.hideShowText   = data.hideShowText;
        this.zoomInText     = data.zoomInText;
        this.zoomOutText    = data.zoomOutText;
        this.textColor      = data.textColor;
        this.bottomDivBackground = data.bottomDivBackground;
    }
}