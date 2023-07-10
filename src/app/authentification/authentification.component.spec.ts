import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthentificationComponent } from './authentification.component';

describe('AuthentificationComponent', () => {
  let component: AuthentificationComponent;
  let fixture: ComponentFixture<AuthentificationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuthentificationComponent]
    });
    fixture = TestBed.createComponent(AuthentificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
