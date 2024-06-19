import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Msg } from '../models/msg';
import { Observable } from 'rxjs';
import { Restaurant } from '../models/restaurant';
import { Reservation } from '../models/reservation';

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
}
