import { Component } from '@angular/core';
import { Order } from '../models/order';
import { WaiterService } from '../services/waiter.service';
import { Restaurant } from '../models/restaurant';
import { User } from '../models/user';

@Component({
  selector: 'app-waiter-delivery',
  templateUrl: './waiter-delivery.component.html',
  styleUrls: ['./waiter-delivery.component.css']
})
export class WaiterDeliveryComponent {
  currentOrders: Order[] = [];
  selectedOrder: Order | null = null;
  estimatedTime: string = '';
  restaurant:Restaurant = new Restaurant()
  waiter:User = new User()

  constructor(private waiterService: WaiterService) {}

  ngOnInit(): void {
    this.waiter = JSON.parse(localStorage.getItem("user") || "");
    this.waiterService.getRestoranByWaiterId(this.waiter._id).subscribe(
      (rest)=>{
        if(rest){
          this.restaurant = rest
          this.fetchCurrentOrders();
        }
      }
    )

  }

  fetchCurrentOrders() {
    this.waiterService.getCurrentOrders(this.restaurant._id).subscribe(
      (orders) => {
        this.currentOrders = orders;
        console.log(this.restaurant._id)
      },
      (error) => {
        console.error('Error fetching current orders:', error);
      }
    );
  }

  confirmOrder(order: Order) {
    if (!this.estimatedTime) {
      alert('Selektujte očekivano vreme dostave');
      return;
    }

    this.waiterService.confirmOrRejectOrder(order._id, 'confirm', this.estimatedTime).subscribe(
      (updatedOrder) => {
        this.fetchCurrentOrders();
      },
      (error) => {
        console.error('Error confirming order:', error);
      }
    );
  }

  rejectOrder(order: Order) {
    this.waiterService.confirmOrRejectOrder(order._id, 'reject').subscribe(
      (updatedOrder) => {
        this.fetchCurrentOrders();
      },
      (error) => {
        console.error('Error rejecting order:', error);
      }
    );
  }

  setSelectedOrder(order: Order) {
    this.selectedOrder = order;
  }
}
