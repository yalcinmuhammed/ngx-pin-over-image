import { Component } from '@angular/core';
import { PinOverImageComponent } from './modules/pin-over-image/pin-over-image.component'
import { OptionModel } from './modules/pin-over-image/models/option.model';
import { PinModel } from './modules/pin-over-image/models/pin.model';
import { PointModel } from './modules/pin-over-image/models/point.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  options:OptionModel = new OptionModel;
  pinList:PinModel[] = [];
  constructor(){

  }
  ngOnInit(){
      this.options.setBaseObject({
        imageUrl:"https://busraabaci.files.wordpress.com/2015/04/doga-2.jpg",
        outerDivWidth:600,
        outerDivHeight:500,
        addPinIconUrl:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Toicon-icon-stone-pin.svg/2000px-Toicon-icon-stone-pin.svg.png",
        hideShowIconUrl:"https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/OOjs_UI_icon_eye.svg/2000px-OOjs_UI_icon_eye.svg.png",
        zoomInIconUrl:"https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Zoom_in_font_awesome.svg/2000px-Zoom_in_font_awesome.svg.png",
        zoomOutIconUrl:"https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Zoom_out_font_awesome.svg/2000px-Zoom_out_font_awesome.svg.png",
        progressImgSrc:"https://upload.wikimedia.org/wikipedia/commons/a/ad/YouTube_loading_symbol_3_%28transparent%29.gif",
        pinBackground:"url(https://cdn4.iconfinder.com/data/icons/iconsimple-places/512/pin_1-128.png)",
        pinWidth:20,
        pinHeight:20,
        pinRadius:10,
        pinBorderRadius:10,
        addPinText:"Add Pin",
        hideShowText:"Hide/Show",
        zoomInText:"Zoom In",
        zoomOutText:"Zoom Out",
        textColor:"#fff",
        bottomDivBackground:"linear-gradient(#000000b0, red)"
    });

    let pin1 = new PinModel();
    pin1.id = 1;
    pin1.visibility = "visible";
    let p1:PointModel = new PointModel();
    p1.left = 250;
    p1.top = 250;
    pin1.point = p1;
    this.pinList.push(pin1);

  }

}
