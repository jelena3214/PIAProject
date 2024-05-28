import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPasswordChangePassComponent } from './forgot-password-change-pass.component';

describe('ForgotPasswordChangePassComponent', () => {
  let component: ForgotPasswordChangePassComponent;
  let fixture: ComponentFixture<ForgotPasswordChangePassComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ForgotPasswordChangePassComponent]
    });
    fixture = TestBed.createComponent(ForgotPasswordChangePassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
