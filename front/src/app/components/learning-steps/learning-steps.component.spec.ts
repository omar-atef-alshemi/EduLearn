import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearningStepsComponent } from './learning-steps.component';

describe('LearningStepsComponent', () => {
  let component: LearningStepsComponent;
  let fixture: ComponentFixture<LearningStepsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LearningStepsComponent]
    });
    fixture = TestBed.createComponent(LearningStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
