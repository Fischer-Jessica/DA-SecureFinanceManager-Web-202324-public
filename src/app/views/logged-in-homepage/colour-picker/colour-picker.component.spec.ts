import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColourPickerComponent } from './colour-picker.component';

describe('ColourPickerComponent', () => {
  let component: ColourPickerComponent;
  let fixture: ComponentFixture<ColourPickerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ColourPickerComponent]
    });
    fixture = TestBed.createComponent(ColourPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
