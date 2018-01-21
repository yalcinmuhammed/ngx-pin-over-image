import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PinOverImageComponent } from './pin-over-image.component';

describe('PinOverImageComponent', () => {
  let component: PinOverImageComponent;
  let fixture: ComponentFixture<PinOverImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PinOverImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PinOverImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
