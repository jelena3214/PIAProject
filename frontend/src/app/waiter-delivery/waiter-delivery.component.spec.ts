import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaiterDeliveryComponent } from './waiter-delivery.component';

describe('WaiterDeliveryComponent', () => {
  let component: WaiterDeliveryComponent;
  let fixture: ComponentFixture<WaiterDeliveryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WaiterDeliveryComponent]
    });
    fixture = TestBed.createComponent(WaiterDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
