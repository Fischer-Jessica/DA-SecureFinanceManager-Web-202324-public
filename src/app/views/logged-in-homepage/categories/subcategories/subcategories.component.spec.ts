import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcategoriesComponent } from './subcategories.component';

describe('SubcategoryComponent', () => {
  let component: SubcategoriesComponent;
  let fixture: ComponentFixture<SubcategoriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubcategoriesComponent]
    });
    fixture = TestBed.createComponent(SubcategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
