import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Msg } from '../models/msg';
import { Order } from '../models/order';
import { Reservation } from '../models/reservation';

@Injectable({
  providedIn: 'root'
})
export class GuestService {
  url:string = "http://localhost:4000";

  constructor(private http:HttpClient) { }

  registerGuest(us:User){
    const data =
    {
      user: us
    }
    return this.http.post<Msg>(`${this.url}/guest/register`, data);
  }

  getNumberOfGuests(){
    return this.http.get<number>(`${this.url}/guest/getNumberOfGuests`);
  }

  getAllGuests(){
    return this.http.get<User[]>(`${this.url}/guest/getAll`);
  }

  getAllOrders(username:string){
    return this.http.get<Order[]>(`${this.url}/guest/${username}/getAllOrders`);
  }

  getAllReservations(username:string){
    return this.http.get<Reservation[]>(`${this.url}/guest/${username}/getAllReservations`);
  }

  strikeGuest(username:string){
    return this.http.get<User>(`${this.url}/guest/${username}/strike`);
  }
}
