import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Subcategories } from './subcategories.component';

describe('SubcategoryComponent', () => {
  let component: Subcategories;
  let fixture: ComponentFixture<Subcategories>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Subcategories]
    });
    fixture = TestBed.createComponent(Subcategories);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
