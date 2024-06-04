import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestRestaurantComponent } from './guest-restaurant.component';

describe('GuestRestaurantComponent', () => {
  let component: GuestRestaurantComponent;
  let fixture: ComponentFixture<GuestRestaurantComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GuestRestaurantComponent]
    });
    fixture = TestBed.createComponent(GuestRestaurantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
