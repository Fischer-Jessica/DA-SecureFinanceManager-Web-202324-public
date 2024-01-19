import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateLabelComponent } from './update-label.component';

describe('UpdateLabelComponent', () => {
  let component: UpdateLabelComponent;
  let fixture: ComponentFixture<UpdateLabelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateLabelComponent]
    });
    fixture = TestBed.createComponent(UpdateLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
