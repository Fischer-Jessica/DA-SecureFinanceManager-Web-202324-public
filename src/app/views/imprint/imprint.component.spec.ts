import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ImprintComponent} from './imprint.component';

describe('ImprintComponent', () => {
  let component: ImprintComponent;
  let fixture: ComponentFixture<ImprintComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImprintComponent]
    });
    fixture = TestBed.createComponent(ImprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
