import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorldNetworkComponent } from './world-network.component';

describe('WorldNetworkComponent', () => {
  let component: WorldNetworkComponent;
  let fixture: ComponentFixture<WorldNetworkComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WorldNetworkComponent]
    });
    fixture = TestBed.createComponent(WorldNetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
