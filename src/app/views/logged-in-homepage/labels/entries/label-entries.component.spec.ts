import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelEntriesComponent } from './label-entries.component';

describe('EntriesComponent', () => {
  let component: LabelEntriesComponent;
  let fixture: ComponentFixture<LabelEntriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LabelEntriesComponent]
    });
    fixture = TestBed.createComponent(LabelEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
