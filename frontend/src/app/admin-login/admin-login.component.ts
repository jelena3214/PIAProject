import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  username: string = '';
  password: string = '';
  message: string = '';

  constructor(private router: Router, private userService:UserService, private appComp:AppComponent) { }

  login(){
    this.userService.login(this.username, this.password).subscribe(
      (user)=>{
        if(user == null){
          this.message = "Korisnik ne postoji!"
          return;
        }
        localStorage.setItem("user", JSON.stringify(user));
        this.appComp.changeNavBar()
        this.router.navigate(['/adminStart']);
      }
    )
  }
}
