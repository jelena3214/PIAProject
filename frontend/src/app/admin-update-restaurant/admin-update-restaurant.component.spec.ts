import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUpdateRestaurantComponent } from './admin-update-restaurant.component';

describe('AdminUpdateRestaurantComponent', () => {
  let component: AdminUpdateRestaurantComponent;
  let fixture: ComponentFixture<AdminUpdateRestaurantComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminUpdateRestaurantComponent]
    });
    fixture = TestBed.createComponent(AdminUpdateRestaurantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
