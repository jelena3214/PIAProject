import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Restaurant } from '../models/restaurant';
import { Observable } from 'rxjs/internal/Observable';
import { Reservation } from '../models/reservation';
import { Msg } from '../models/msg';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  url:string = "http://localhost:4000";

  constructor(private http:HttpClient) { }

  getNumberOfRestaurants(){
    return this.http.get<number>(`${this.url}/restaurant/getNumberOfRestaurants`);
  }

  getAllRestaurants(){
    return this.http.get<Restaurant[]>(`${this.url}/restaurant/getAll`);
  }

  getRestaurantById(id: string): Observable<Restaurant> {
    return this.http.get<Restaurant>(`${this.url}/restaurant/${id}`);
  }

  getRestaurantReservationsById(id: string): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.url}/restaurant/getReservations/${id}`);
  }

  makeReservation(reservation: Reservation): Observable<any> {
    return this.http.post(`${this.url}/restaurant/makeReservation`, reservation);
  }

  addWaiterToRestaurant(restaurantId:string, waiterUsername:string): Observable<Msg> {
    const data = {
      restaurant: restaurantId,
      waiter: waiterUsername
    }
    return this.http.post<Msg>(`${this.url}/restaurant/addWaiter`, data);
  }

  getNumOfReservationsLast24Hours(){
    return this.http.get<number>(`${this.url}/reservation/last24h`);
  }

  getNumOfReservationsLast7Days(){
    return this.http.get<number>(`${this.url}/reservation/last7d`);
  }

  getNumOfReservationsLast30Days(){
    return this.http.get<number>(`${this.url}/reservation/last30d`);
  }
}
