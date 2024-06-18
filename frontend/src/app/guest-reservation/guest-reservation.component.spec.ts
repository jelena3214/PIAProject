import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestReservationComponent } from './guest-reservation.component';

describe('GuestReservationComponent', () => {
  let component: GuestReservationComponent;
  let fixture: ComponentFixture<GuestReservationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GuestReservationComponent]
    });
    fixture = TestBed.createComponent(GuestReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
