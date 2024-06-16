import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Restaurant } from '../models/restaurant';
import { Observable } from 'rxjs/internal/Observable';
import { Reservation } from '../models/reservation';
import { Msg } from '../models/msg';
import { Shape } from '../models/shape';
import { Dish } from '../models/dish';

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

  addRestaurant(rest: { Adresa: string; Tip: string; Naziv: string; Opis: string; ProsecnaOcena: number; Konobari: never[]; Telefon: string; RadniDani: { "1": { od: string; do: string; }; "2": { od: string; do: string; }; "3": { od: string; do: string; }; "4": { od: string; do: string; }; "5": { od: string; do: string; }; "6": { od: string; do: string; }; "7": { od: string; do: string; }; }; }, layout:Shape[]){
    const data = {
      restaurant:rest,
      layout:layout
    }
    return this.http.post<Msg>(`${this.url}/restaurant/addRestaurant`, data);
  }

  updateRestaurantWorkingHours(restaurantId: string, workingHours: any) {
    const data = {
      workingHours: workingHours
    }
    return this.http.put<Msg>(`${this.url}/restaurant/${restaurantId}/working-hours`, data);
  }

  getRestaurantLayout(restaurantId:string){
    return this.http.get<Shape[]>(`${this.url}/restaurant/${restaurantId}/getLayout`);
  }

  getReservationsForSpecificDateTime(restaurantId:string, dateTime:string){
    const data = {
      restoranId:restaurantId,
      datumVreme:dateTime
    }
    return this.http.post<Reservation[]>(`${this.url}/restaurant/getReservationsForTime`, data);
  }

  saveDishes(formData: FormData){
    return this.http.post<any>(`${this.url}/restaurant/saveDishes`, formData);
  }
}
