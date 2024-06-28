import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Dish } from '../models/dish';
import { RestaurantService } from '../services/restaurant.service';
import { Order } from '../models/order';

@Component({
  selector: 'app-make-delivery-request',
  templateUrl: './make-delivery-request.component.html',
  styleUrls: ['./make-delivery-request.component.css']
})
export class MakeDeliveryRequestComponent implements OnInit{

  restaurantId:string = ""
  restaurantDishes: Dish[] = []
  message:string = ""

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
    this.message = ""
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
    let sum = 0
    let naruceno: { naziv: string; kolicina: number; }[] = []

    this.cart.forEach(item =>{
      sum += item.quantity * item.dish.cena;
      naruceno.push({"naziv":item.dish.naziv, "kolicina":item.quantity})
    })

    let newOrder = new Order()
    newOrder.iznos = sum
    newOrder.restoranId = this.restaurantId
    newOrder.status = "K"
    newOrder.vremeDostave = "0"
    newOrder.datum = new Date()
    newOrder.naruceno = naruceno
    newOrder.korIme = JSON.parse(localStorage.getItem("user") || "").korIme

    this.restaurantService.makeAnOrder(newOrder).subscribe(
      (order)=>{
        if(order){
          this.message = "Uspešno naručeno!"
        }else{
          this.message = "Greška pri naručivanju!"
        }
      }
    )

    this.cart = [];
  }

}
