import { Component, OnInit } from '@angular/core';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  isGuest:boolean = false
  iswaiter:boolean = false
  isAdmin:boolean = false

  ngOnInit(): void {
    this.changeNavBar();
  }

  changeNavBar(){
    try {
      const us = JSON.parse(localStorage.getItem('user') || '');
      if(us.tip == 'gost')this.isGuest = true
      if(us.tip == 'admin')this.isAdmin = true
    } catch (error) {
      console.log('error app comp - ger user')
      return
    }
  }

  logOut(){
    localStorage.clear()
    this.isGuest = false
    this.iswaiter = false
  }
}
