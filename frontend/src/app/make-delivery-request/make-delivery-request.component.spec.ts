import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeDeliveryRequestComponent } from './make-delivery-request.component';

describe('MakeDeliveryRequestComponent', () => {
  let component: MakeDeliveryRequestComponent;
  let fixture: ComponentFixture<MakeDeliveryRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MakeDeliveryRequestComponent]
    });
    fixture = TestBed.createComponent(MakeDeliveryRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
