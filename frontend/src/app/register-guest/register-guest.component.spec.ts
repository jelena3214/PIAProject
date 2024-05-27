import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterGuestComponent } from './register-guest.component';

describe('RegisterGuestComponent', () => {
  let component: RegisterGuestComponent;
  let fixture: ComponentFixture<RegisterGuestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterGuestComponent]
    });
    fixture = TestBed.createComponent(RegisterGuestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
