import { Component, OnInit } from '@angular/core';
import { Restaurant } from '../models/restaurant';
import { HttpClient } from '@angular/common/http';
import { RestaurantService } from '../services/restaurant.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-guest-restaurant',
  templateUrl: './guest-restaurant.component.html',
  styleUrls: ['./guest-restaurant.component.css']
})
export class GuestRestaurantComponent implements OnInit{
  numberOfRestaurants: number = 0;
  numberOfGuests: number = 0;
  restaurantInfo: Restaurant[] = [];
  filteredRestaurants: Restaurant[] = [];
  name:string = ""
  address:string = ""
  type:string = ""
  waiterInfoMap: { [restaurantId: string]: string } = {};


  constructor(private http: HttpClient, private restaurantService:RestaurantService, private userService:UserService) { }

  ngOnInit(): void {
    this.restaurantService.getAllRestaurants().subscribe(
      (restaurants)=>{
        if(restaurants){
          this.restaurantInfo = restaurants
          this.filteredRestaurants = restaurants
          restaurants.forEach(restaurant => {
            this.getWaitersInfoAndDisplay(restaurant._id);
          });
        }
      }
    )
  }

  searchRestaurants() {
    this.filteredRestaurants = this.restaurantInfo.filter(restaurant => {
      const nazivLower = restaurant.Naziv.toLowerCase();
      const adresaLower = restaurant.Adresa.toLowerCase();
      const tipLower = restaurant.Tip.toLowerCase();
      const searchNameLower = this.name.toLowerCase();
      const searchAddressLower = this.address.toLowerCase();
      const searchTypeLower = this.type.toLowerCase();

      const isNameMatch = this.name.trim() === '' || nazivLower.includes(searchNameLower);
      const isAddressMatch = this.address.trim() === '' || adresaLower.includes(searchAddressLower);
      const isTypeMatch = this.type.trim() === '' || tipLower.includes(searchTypeLower);

      return isNameMatch && isAddressMatch && isTypeMatch;
    })
  }

  fullStars(rating:number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  hasHalfStar(rating:number): boolean {
    return rating % 1 >= 0.5 && rating % 1 < 1;
  }

  hasQuarterStar(rating:number): boolean {
    return rating % 1 >= 0.75;
  }

  emptyStars(rating:number): number[] {
    const fullStarsCount = Math.floor(rating);
    const halfStarCount = this.hasHalfStar(rating) ? 1 : 0;
    const quarterStarCount = this.hasQuarterStar(rating) ? 1 : 0;
    return Array(5 - fullStarsCount - halfStarCount - quarterStarCount).fill(0);
  }

  async getWaitersInfo(restaurantId: string): Promise<string> {
    const restaurant = this.restaurantInfo.find(r => r._id === restaurantId);
    if (!restaurant) {
      return 'Restaurant not found';
    }

    const waiterPromises: Promise<string>[] = [];

    restaurant.Konobari.forEach(username => {
      waiterPromises.push(this.getUserFullName(username));
    });

    const waiterNames = await Promise.all(waiterPromises);
    return waiterNames.join('  ');
  }

  private async getUserFullName(username: string): Promise<string> {
    try {
      const user = await this.userService.getUserByUsername(username).toPromise();
      if (user && user.aktivan) {
        return `${user.ime} ${user.prezime}`;
      } else {
        return ''; // Handle case where user is not found
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      return ''; // Handle error
    }
  }

  getWaitersInfoAndDisplay(restaurantId: string): void {
    this.getWaitersInfo(restaurantId)
      .then(waitersInfo => {
        this.waiterInfoMap[restaurantId] = waitersInfo;
      })
      .catch(error => {
        console.error('Error fetching waiters info:', error);
      });
  }
}
