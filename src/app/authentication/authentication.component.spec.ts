import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AuthenticationComponent} from './authentication.component';

describe('AuthentificationComponent', () => {
  let component: AuthenticationComponent;
  let fixture: ComponentFixture<AuthenticationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuthenticationComponent]
    });
    fixture = TestBed.createComponent(AuthenticationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
