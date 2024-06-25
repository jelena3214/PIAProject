import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private userService:UserService, private router:Router, private appComp:AppComponent){}

  username:string = ""
  password:string = ""
  message:string = ""

  login(){
    this.userService.login(this.username, this.password).subscribe(
      (user)=>{
        if(user == null){
          this.message = "Korisnik ne postoji!"
          return;
        }else if (user.prihvacen && user.aktivan){
          localStorage.setItem("user", JSON.stringify(user));
          this.appComp.changeNavBar()
          if(user.tip == 'gost'){
            this.router.navigate(['guestStart']);
          }else if(user.tip == 'konobar'){
            this.router.navigate(['waiterStart']);
          }else{
            this.message = "Ako ste admin ulogujte se preko Vaše login stranice!"
          }
        }else if(user.blokiran){
          this.message = "Vaš zahtev je odbijen!"
        }else if(!user.prihvacen){
          this.message = "Još niste aktivan korisnik!"
        }else if(!user.aktivan){
          this.message = "Vaš nalog je deaktiviran!"
        }
      }
    )
  }

}
