import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSubcategoryComponent } from './update-subcategory.component';

describe('UpdateSubcategoryComponent', () => {
  let component: UpdateSubcategoryComponent;
  let fixture: ComponentFixture<UpdateSubcategoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateSubcategoryComponent]
    });
    fixture = TestBed.createComponent(UpdateSubcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
