import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsertableComponent } from './usertable.component';

describe('UsertableComponent', () => {
  let component: UsertableComponent;
  let fixture: ComponentFixture<UsertableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsertableComponent]
    });
    fixture = TestBed.createComponent(UsertableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
