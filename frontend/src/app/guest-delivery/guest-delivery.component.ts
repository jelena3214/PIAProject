import { Component, OnInit } from '@angular/core';
import { Order } from '../models/order';
import { RestaurantService } from '../services/restaurant.service';
import { GuestService } from '../services/guest.service';

@Component({
  selector: 'app-guest-delivery',
  templateUrl: './guest-delivery.component.html',
  styleUrls: ['./guest-delivery.component.css']
})
export class GuestDeliveryComponent implements OnInit{

  allDeliveries:Order[] = []
  currentOrders: Order[] = [];
  previousOrders: Order[] = [];
  restaurantsMap: { [key: string]: string } = {};

  constructor(private restaurantService:RestaurantService, private guestService:GuestService){

  }

  ngOnInit(): void {
    this.guestService.getAllOrders(JSON.parse(localStorage.getItem("user") || "").korIme).subscribe(
      (orders)=>{
        this.allDeliveries = orders
        this.filterOrders()
        this.loadAllRestaurants()
        console.log(this.allDeliveries)
      }
    )
  }

  loadAllRestaurants() {
    this.restaurantService.getAllRestaurants().subscribe(restaurants => {
      restaurants.forEach(rest => {
        this.restaurantsMap[rest._id] = rest.Naziv;
      });
    });
  }

  filterOrders() {
    const now = new Date();

    this.currentOrders = this.allDeliveries.filter(order =>
      (order.status === 'K') ||
      (order.status === 'P' && new Date(order.datumDostave) > now)
    );

    this.previousOrders = this.allDeliveries.filter(order =>
      (order.status === 'O') ||
      (order.status === 'P' && new Date(order.datumDostave) <= now)
    ).sort((a, b) => new Date(b.datum).getTime() - new Date(a.datum).getTime());
  }

  getRestaurantName(restoranId: string) {
    return this.restaurantsMap[restoranId] || 'NA';
  }

  getStatus(status: string): string {
    if(status == "K"){
      return "Kreirana"
    }else if(status == "O"){
      return "Odbijena"
    }else{
      return "Prihvaćena"
    }
  }

  getDeliveryTime(vremeDostave: string): string {
    if(vremeDostave == '0'){
      return ""
    }else if(vremeDostave == "23"){
      return "20 do 30 minuta";
    }else if(vremeDostave == "34"){
      return "30 do 40 minuta"
    }else{
      return "50 do 60 minuta"
    }
  }

}
