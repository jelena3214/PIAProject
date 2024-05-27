import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestStartComponent } from './guest-start.component';

describe('GuestStartComponent', () => {
  let component: GuestStartComponent;
  let fixture: ComponentFixture<GuestStartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GuestStartComponent]
    });
    fixture = TestBed.createComponent(GuestStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
