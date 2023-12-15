import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DiagramsComponent} from './diagrams.component';

describe('LoggedInDiagramsComponent', () => {
  let component: DiagramsComponent;
  let fixture: ComponentFixture<DiagramsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiagramsComponent]
    });
    fixture = TestBed.createComponent(DiagramsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
