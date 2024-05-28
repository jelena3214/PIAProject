import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPasswordSafeqaComponent } from './forgot-password-safeqa.component';

describe('ForgotPasswordSafeqaComponent', () => {
  let component: ForgotPasswordSafeqaComponent;
  let fixture: ComponentFixture<ForgotPasswordSafeqaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ForgotPasswordSafeqaComponent]
    });
    fixture = TestBed.createComponent(ForgotPasswordSafeqaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
