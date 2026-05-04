import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestCoursesComponent } from './latest-courses.component';

describe('LatestCoursesComponent', () => {
  let component: LatestCoursesComponent;
  let fixture: ComponentFixture<LatestCoursesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LatestCoursesComponent]
    });
    fixture = TestBed.createComponent(LatestCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
