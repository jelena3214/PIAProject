import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Msg } from '../models/msg';
import { Observable } from 'rxjs';
import { Restaurant } from '../models/restaurant';
import { Reservation } from '../models/reservation';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class WaiterService {

  url:string = "http://localhost:4000";

  constructor(private http:HttpClient) { }

  registerWaiter(us:User){
    const data =
    {
      user: us
    }
    return this.http.post<Msg>(`${this.url}/waiter/register`, data);
  }

  getAllWaiters(){
    return this.http.get<User[]>(`${this.url}/waiter/getAll`);
  }

  getRestoranByWaiterId(konobarId: string): Observable<Restaurant> {
    return this.http.get<Restaurant>(`${this.url}/waiter/getRestaurant/${konobarId}`);
  }

  updateReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.url}/waiter/updateReservation`, reservation);
  }

  getCurrentOrders(restaurantId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.url}/waiter/orders/current/${restaurantId}`);
  }

  confirmOrRejectOrder(orderId: string, action: string, estimatedTime?: string): Observable<Order> {
    return this.http.post<Order>(`${this.url}/waiter/orders/confirmOrReject`, { orderId, action, estimatedTime });
  }

  getGuestCountByDay(waiterId: string): Observable<any> {
    return this.http.get(`${this.url}/waiter/guestCountByDay/${waiterId}`);
  }

  getGuestDistribution(restaurantId: string): Observable<any> {
    return this.http.get(`${this.url}/waiter/guestDistribution/${restaurantId}`);
  }

  getAverageReservationsByWeekday(restaurantId: string): Observable<any> {
    return this.http.get(`${this.url}/waiter/averageReservationsByWeekday/${restaurantId}`);
  }
}
