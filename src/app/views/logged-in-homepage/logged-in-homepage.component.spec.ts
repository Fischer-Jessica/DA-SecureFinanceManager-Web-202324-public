import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LoggedInHomepageComponent} from './logged-in-homepage.component';

describe('LoggedInHomepageComponent', () => {
  let component: LoggedInHomepageComponent;
  let fixture: ComponentFixture<LoggedInHomepageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoggedInHomepageComponent]
    });
    fixture = TestBed.createComponent(LoggedInHomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
