import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewSubcategoryComponent } from './create-new-subcategory.component';

describe('CreateNewSubcategoryComponent', () => {
  let component: CreateNewSubcategoryComponent;
  let fixture: ComponentFixture<CreateNewSubcategoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateNewSubcategoryComponent]
    });
    fixture = TestBed.createComponent(CreateNewSubcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
