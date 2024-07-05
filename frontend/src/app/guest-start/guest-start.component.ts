import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-guest-start',
  templateUrl: './guest-start.component.html',
  styleUrls: ['./guest-start.component.css']
})
export class GuestStartComponent implements OnInit{
  user:User | null = null
  name:string = ""
  lastName:string = ""
  address:string = ""
  phone: string = ""
  email:string = ""
  creditcard:string = ""
  message:string = ""

  constructor(private userService:UserService, private sanitizer: DomSanitizer){}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem("user") || "")
  }

  onFileSelected(event: any) {
    const photo = event.target.files[0] as File;
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const img = new Image();
      img.onload = () => {
        if (img.naturalWidth > 300 || img.naturalWidth < 100 || img.naturalHeight > 300 || img.naturalHeight < 100) {
          this.message = 'Slika nije dozvoljene velicine.';
          return;
        }

        this.userService.uploadPhoto(photo, this.user?.korIme || "").subscribe(
          (returnVal) => {
            if (this.user) {
              this.user.slika = this.user.korIme + "_" + photo.name;
              localStorage.setItem("user", JSON.stringify(this.user));
            }
          }
        );
      };
      img.src = e.target.result;
    };

    reader.readAsDataURL(photo);
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
      if (this.email.length != 0) {
        //provera da li neko koristi taj mejl
        this.userService.checkIfUserWithEmailExists(this.email).subscribe(response => {
          if(response.exists){
            this.message = "Korisnik sa unetim email-om vec postoji!"
            return
          }else if(this.user){
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(this.email)) {
              this.message = "Mejl nije u dobrom formatu!"
              return
            }
            this.user.mejl = this.email;
            change = true
            if(change){
              this.userService.updateUser(this.user).subscribe((msg) => {
                if(msg.code == 0){
                  console.log("Azurirano!")
                  localStorage.setItem("user", JSON.stringify(this.user))
                }else{
                  console.log("Greska pri azuriranju pdoataka korisnika!")
                }
              });
            }
          }
        });
      }
    }
  }

  oldPass: string = ""
  newPass1:string = ""
  newPass2: string = ""
  message1: string = ""

  changePassword(){

    this.userService.checkPassword(this.user?.korIme || "", this.oldPass).subscribe(
      response => {
        if(!response.correct){
          this.message1 = "Pogresna stara lozinka!"
          return
        }
      }
    )

    if(this.newPass1 != this.newPass2){
      this.message1 = "Unete lozinke se ne poklapaju!"
      return;
    }

    const regex = /^(?=.*[A-Z])(?=.*[a-z]{3})(?=.*\d)(?=.*[!@#$%^&*()-_+=])[A-Za-z][A-Za-z\d!@#$%^&*()-_+=]{5,9}$/;

    if(!regex.test(this.newPass1)){
      this.message1 = "Lozinka nije u dobrom formatu!"
      return
    }

    this.userService.changePassword(this.user?.korIme || "", this.newPass1).subscribe(
      (msg)=>{
        if(msg.code == 0){
          this.message1 = "Uspesno promenjena lozinka"
        }else{
          this.message1 = "Greska pri promeni lozinke"
        }
      }
    )
  }

}
