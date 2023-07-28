import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LoggedInLabelsComponent} from './logged-in-labels.component';

describe('LoggedInLabelsComponent', () => {
  let component: LoggedInLabelsComponent;
  let fixture: ComponentFixture<LoggedInLabelsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoggedInLabelsComponent]
    });
    fixture = TestBed.createComponent(LoggedInLabelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
