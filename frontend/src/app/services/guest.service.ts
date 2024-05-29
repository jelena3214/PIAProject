import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Msg } from '../models/msg';

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
}
