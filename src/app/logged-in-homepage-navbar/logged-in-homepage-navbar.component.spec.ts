import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LoggedInHomepageNavbarComponent} from './logged-in-homepage-navbar.component';

describe('LoggedInHomepageComponent', () => {
  let component: LoggedInHomepageNavbarComponent;
  let fixture: ComponentFixture<LoggedInHomepageNavbarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoggedInHomepageNavbarComponent]
    });
    fixture = TestBed.createComponent(LoggedInHomepageNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
