import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoadmapDetailComponent } from './roadmap-detail.component';

describe('RoadmapDetailComponent', () => {
  let component: RoadmapDetailComponent;
  let fixture: ComponentFixture<RoadmapDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RoadmapDetailComponent]
    });
    fixture = TestBed.createComponent(RoadmapDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
