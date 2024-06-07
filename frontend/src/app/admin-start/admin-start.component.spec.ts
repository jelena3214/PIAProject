import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminStartComponent } from './admin-start.component';

describe('AdminStartComponent', () => {
  let component: AdminStartComponent;
  let fixture: ComponentFixture<AdminStartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminStartComponent]
    });
    fixture = TestBed.createComponent(AdminStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
