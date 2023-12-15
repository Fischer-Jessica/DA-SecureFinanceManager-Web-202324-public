import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcategoryComponent } from './subcategory.component';

describe('SubcategoryComponent', () => {
  let component: SubcategoryComponent;
  let fixture: ComponentFixture<SubcategoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubcategoryComponent]
    });
    fixture = TestBed.createComponent(SubcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
