import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './models/user';
import { Msg } from './models/msg';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url:string = "http://localhost:4000/users";

  constructor(private http:HttpClient) { }

  registerStudent(us:User){
    return this.http.post<Msg>(`${this.url}/registerStudent`, us);
  }

  uploadPhoto(photo:any){
    const formData = new FormData();
    formData.append('image', photo);

    return this.http.post<User>(`${this.url}/upload`, formData);
  }
}
