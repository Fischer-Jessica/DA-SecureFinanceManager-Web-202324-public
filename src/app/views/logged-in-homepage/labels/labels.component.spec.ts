import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LabelsComponent} from './labels.component';

describe('LoggedInLabelsComponent', () => {
  let component: LabelsComponent;
  let fixture: ComponentFixture<LabelsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LabelsComponent]
    });
    fixture = TestBed.createComponent(LabelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
