import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LoggedInOverviewComponent} from './logged-in-overview.component';

describe('LoggedInOverviewComponent', () => {
  let component: LoggedInOverviewComponent;
  let fixture: ComponentFixture<LoggedInOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoggedInOverviewComponent]
    });
    fixture = TestBed.createComponent(LoggedInOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
