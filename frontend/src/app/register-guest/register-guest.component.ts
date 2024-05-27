import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user';

@Component({
  selector: 'app-register-guest',
  templateUrl: './register-guest.component.html',
  styleUrls: ['./register-guest.component.css']
})
export class RegisterGuestComponent {
  constructor(private userService:UserService){}

  username:string = ""
  password:string = ""
  safeQuestion: string= ""
  safeResponse:string = ""
  name:string = ""
  lastName:string = ""
  gender:string = ""
  adr:string = ""
  phone:string = ""
  email:string = ""
  photo:File|null = null
  creditCard:string = ""
  message:string = ""
  imageWidth:number = 0
  imageHeight:number = 0

  onFileSelected(event: any) {
    this.photo = event.target.files[0] as File;
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const img = new Image();
      img.onload = () => {
        this.imageWidth = img.naturalWidth;
        this.imageHeight = img.naturalHeight;
      };
      img.src = e.target.result;
    };

    reader.readAsDataURL(this.photo);
  }

  registerUser(){
    // lozinka
    const regex = /^(?=.*[A-Z])(?=.*[a-z]{3})(?=.*\d)(?=.*[!@#$%^&*()-_+=])[A-Za-z][A-Za-z\d!@#$%^&*()-_+=]{5,9}$/;

    if(!regex.test(this.password)){
      this.message = "Lozinka nije u dobrom formatu!"
      return
    }

    const phoneRegex = /^\+3816\d{8,9}$/;
    if(!phoneRegex.test(this.phone)){
      this.message = "Telefon nije u dobrom formatu!"
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.message = "Mejl nije u dobrom formatu!"
      return
    }

    let usePhoto = false;

    if (!this.photo) {
      usePhoto = true;
    }else{
      if (this.imageWidth > 300  || this.imageWidth < 100 || this.imageHeight > 300  || this.imageHeight < 100) {
        this.message = 'Slika nije dozvoljene velicine.';
        return;
      }

      const allowedFormats = ['image/jpeg', 'image/png'];
      if (!allowedFormats.includes(this.photo.type)) {
        this.message = 'Slika nije u dozvoljenom formatu. Dozvoljeni formati su JPG i PNG.';
        return;
      }
    }

    const imagePath = 'upload/user.png';
    let newGuest = new User(this.name, this.lastName, this.username, this.password, this.gender, this.adr, this.phone, this.email, "gost", false, {pitanje:this.safeQuestion, odgovor:this.safeResponse}, imagePath, this.creditCard);

    this.userService.registerGuest(newGuest).subscribe(
      (msg)=>{
        this.message = msg.mess;
        if(msg.code == 1){
          this.message = "Greska na serveru";
          return;
        }else if(msg.code == 2){
          this.message = "Korisnik sa datim korisnickim imenom vec postoji!"
          return;
        }else if(msg.code == 3){
          this.message = "Korisnik sa datim mejlom vec postoji!"
          return;
        }else{
          //success
          if(usePhoto == false){
            this.userService.uploadPhoto(this.photo, this.username).subscribe()
          }
          this.message = "Uspešna registracija. Morate sačekati da se Vaš zahtev odobri!"
        }
      }
    )
  }
}
