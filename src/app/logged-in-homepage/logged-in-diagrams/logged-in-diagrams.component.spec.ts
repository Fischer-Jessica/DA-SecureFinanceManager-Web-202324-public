import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LoggedInDiagramsComponent} from './logged-in-diagrams.component';

describe('LoggedInDiagramsComponent', () => {
  let component: LoggedInDiagramsComponent;
  let fixture: ComponentFixture<LoggedInDiagramsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoggedInDiagramsComponent]
    });
    fixture = TestBed.createComponent(LoggedInDiagramsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
