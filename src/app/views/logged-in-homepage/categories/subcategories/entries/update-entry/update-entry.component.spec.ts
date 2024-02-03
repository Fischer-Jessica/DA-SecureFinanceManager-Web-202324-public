import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UpdateEntryComponent} from './update-entry.component';

describe('UpdateEntryComponent', () => {
  let component: UpdateEntryComponent;
  let fixture: ComponentFixture<UpdateEntryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateEntryComponent]
    });
    fixture = TestBed.createComponent(UpdateEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
