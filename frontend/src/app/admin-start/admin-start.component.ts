import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { GuestService } from '../services/guest.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-admin-start',
  templateUrl: './admin-start.component.html',
  styleUrls: ['./admin-start.component.css']
})
export class AdminStartComponent implements OnInit{
  allGuests:User[] = []

  constructor(private guestService:GuestService, private userService: UserService){}

  ngOnInit(): void {
    this.guestService.getAllGuests().subscribe(
      (guests)=>{
        if(guests) this.allGuests = guests
      }
    )
  }

  changeStatus(username: string){
    this.userService.getUserByUsername(username).subscribe(
      (user)=>{
        if(user){
          user.aktivan = !user.aktivan
          this.userService.updateUser(user).subscribe((msg) => {
            if(msg.code == 0){
              console.log("Azurirano!")
              this.ngOnInit()
            }else{
              console.log("Greska pri azuriranju podataka korisnika!")
            }
          });
        }
      }
    )
  }

  acceptUser(username: string){
    this.userService.getUserByUsername(username).subscribe(
      (user)=>{
        if(user){
          user.prihvacen = true
          user.aktivan = true
          this.userService.updateUser(user).subscribe((msg) => {
            if(msg.code == 0){
              console.log("Azurirano!")
              this.ngOnInit()
            }else{
              console.log("Greska pri azuriranju podataka korisnika!")
            }
          });
        }
      }
    )
  }

  declineUser(username: string){
    this.userService.getUserByUsername(username).subscribe(
      (user)=>{
        if(user){
          user.prihvacen = false
          user.blokiran = true
          this.userService.updateUser(user).subscribe((msg) => {
            if(msg.code == 0){
              console.log("Azurirano!")
              this.ngOnInit()
            }else{
              console.log("Greska pri azuriranju podataka korisnika!")
            }
          });
        }
      }
    )
  }

}
