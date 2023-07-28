import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LoggedInCategoriesComponent} from './logged-in-categories.component';

describe('LoggedInCategoriesComponent', () => {
  let component: LoggedInCategoriesComponent;
  let fixture: ComponentFixture<LoggedInCategoriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoggedInCategoriesComponent]
    });
    fixture = TestBed.createComponent(LoggedInCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
