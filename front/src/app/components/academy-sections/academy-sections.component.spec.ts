import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademySectionsComponent } from './academy-sections.component';

describe('AcademySectionsComponent', () => {
  let component: AcademySectionsComponent;
  let fixture: ComponentFixture<AcademySectionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AcademySectionsComponent]
    });
    fixture = TestBed.createComponent(AcademySectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
