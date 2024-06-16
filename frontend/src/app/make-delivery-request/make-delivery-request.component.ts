import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Dish } from '../models/dish';
import { RestaurantService } from '../services/restaurant.service';

@Component({
  selector: 'app-make-delivery-request',
  templateUrl: './make-delivery-request.component.html',
  styleUrls: ['./make-delivery-request.component.css']
})
export class MakeDeliveryRequestComponent implements OnInit{

  restaurantId:string = ""
  restaurantDishes: Dish[] = []

  cart: { dish: Dish, quantity: number }[] = [];

  constructor(private route:ActivatedRoute, private restaurantService:RestaurantService){

  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.restaurantId = params['restaurantId']

      this.restaurantService.getDishes(this.restaurantId).subscribe(
        (dishes)=>{
          this.restaurantDishes = dishes
          console.log(dishes)
        }
      )
    });
  }

  addToCart(dish: Dish, quantity: number) {
    const existingItem = this.cart.find(item => item.dish.naziv === dish.naziv);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cart.push({ dish, quantity });
    }
  }

  removeFromCart(dish: Dish) {
    this.cart = this.cart.filter(item => item.dish.naziv !== dish.naziv);
  }

  confirmOrder() {
    console.log('Order confirmed:', this.cart);
    // Ovdje možete dodati logiku za potvrdu porudžbine, npr. slanje podataka na server
    this.cart = []; // prazni korpu nakon potvrde porudžbine
  }

}
