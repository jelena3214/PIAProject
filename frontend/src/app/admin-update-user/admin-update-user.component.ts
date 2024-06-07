import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { User } from '../models/user';

@Component({
  selector: 'app-admin-update-user',
  templateUrl: './admin-update-user.component.html',
  styleUrls: ['./admin-update-user.component.css']
})
export class AdminUpdateUserComponent implements OnInit{
  constructor(private userService:UserService, private route: ActivatedRoute){}

  user:User | null = null;
  message:string = ""
  name:string = ""
  lastName:string = ""
  address:string = ""
  phone: string = ""
  creditcard:string = ""

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userService.getUserByUsername(params['username']).subscribe(
        (user)=>{
          this.user = user
        }
      )
    });
  }

  onFileSelected(event: any) {
    const photo = event.target.files[0] as File;
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const img = new Image();
      img.onload = () => {
        if (img.naturalWidth > 300  || img.naturalWidth < 100 || img.naturalHeight > 300  || img.naturalHeight < 100) {
          this.message = 'Slika nije dozvoljene velicine.';
          return;
        }
      };
      img.src = e.target.result;
    };

    reader.readAsDataURL(photo);
    this.userService.uploadPhoto(photo, this.user?.korIme || "").subscribe(
      (returnVal)=>{
        if(this.user){
          this.user.slika = photo.name
        }
      }
    )
  }

  onSubmit(): void {
    this.message = ""
    let change = false
    if (this.user) {
      if (this.name.length != 0) {
        this.user.ime = this.name;
        change = true
      }
      if (this.lastName.length != 0) {
        this.user.prezime = this.lastName;
        change = true
      }
      if (this.phone.length != 0) {
        const phoneRegex = /^\+3816\d{8,9}$/;
        if(!phoneRegex.test(this.phone)){
          this.message = "Telefon nije u dobrom formatu!"
          return
        }
        this.user.telefon = this.phone;
        change = true
      }
      if (this.address.length != 0) {
        this.user.adresa = this.address;
        change = true
      }
      if (this.creditcard.length != 0) {
        this.user.brojKreditneKartice = this.creditcard;
        change = true
      }

      if(change){
        this.userService.updateUser(this.user).subscribe((msg) => {
          if(msg.code == 0){
            console.log("Azurirano!")
          }else{
            console.log("Greska pri azuriranju podataka korisnika!")
          }
        });
      }
    }
  }
}
