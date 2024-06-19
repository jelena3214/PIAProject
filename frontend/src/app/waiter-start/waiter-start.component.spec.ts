import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaiterStartComponent } from './waiter-start.component';

describe('WaiterStartComponent', () => {
  let component: WaiterStartComponent;
  let fixture: ComponentFixture<WaiterStartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WaiterStartComponent]
    });
    fixture = TestBed.createComponent(WaiterStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
