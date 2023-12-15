import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Entries } from './entries.component';

describe('EntriesComponent', () => {
  let component: Entries;
  let fixture: ComponentFixture<Entries>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Entries]
    });
    fixture = TestBed.createComponent(Entries);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
