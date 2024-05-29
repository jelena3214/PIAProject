import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Msg } from '../models/msg';
import { SafeQA } from '../models/safeqa';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url:string = "http://localhost:4000";

  constructor(private http:HttpClient) { }

  uploadPhoto(photo:any, user:string){
    const formData = new FormData();
    formData.append('file', photo);
    formData.append('user', user);

    return this.http.post<any>(`${this.url}/uploadPhoto`, formData);
  }

  login(username:string, pass:string){
    const data = {
      username:username,
      password:pass
    }

    return this.http.post<User>(`${this.url}/user/login`, data);
  }

  getUsersSafeQA(username:string){
    const data = {
      username: username
    }

    return this.http.post<SafeQA>(`${this.url}/user/getSafeQA`, data);
  }

  changePassword(username:string, password:string){
    const data = {
      username: username,
      password: password
    }

    return this.http.post<Msg>(`${this.url}/user/changePassword`, data);
  }
}
