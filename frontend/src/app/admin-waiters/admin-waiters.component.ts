import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { WaiterService } from '../services/waiter.service';
import { Restaurant } from '../models/restaurant';
import { RestaurantService } from '../services/restaurant.service';

@Component({
  selector: 'app-admin-waiters',
  templateUrl: './admin-waiters.component.html',
  styleUrls: ['./admin-waiters.component.css']
})
export class AdminWaitersComponent implements OnInit{

  allWaiters:User[] = []
  allRestaurants:Restaurant[] = []

  username:string = ""
  password:string = ""
  safeQuestion: string= "Kako se zovete?"
  safeResponse:string = ""
  name:string = ""
  lastName:string = ""
  gender:string = ""
  adr:string = ""
  phone:string = ""
  email:string = ""
  photo:File|null = null
  message:string = ""
  imageWidth:number = 0
  imageHeight:number = 0
  restaurant:string = ""

  constructor(private waiterService:WaiterService, private userService: UserService, private restaurantService:RestaurantService){}

  ngOnInit(): void {
    this.waiterService.getAllWaiters().subscribe(
      (waiters)=>{
        if(waiters) this.allWaiters = waiters
      }
    )

    this.restaurantService.getAllRestaurants().subscribe(
      (rest)=>{
        if(rest) {
          this.allRestaurants = rest
          console.log(rest)
        }
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

  registerWaiter(){
    let restaurantId = this.restaurant
    let konobarUsername = this.username
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

    const imagePath = 'user.png';
    this.safeResponse = this.name

    let newWaiter = new User(this.name, this.lastName, this.username, this.password, this.gender, this.adr, this.phone, this.email, "konobar", true, true, false, {pitanje:this.safeQuestion, odgovor:this.safeResponse}, imagePath, "");
    console.log(newWaiter)

    this.waiterService.registerWaiter(newWaiter).subscribe(
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
          //dodavanje da radi u tom restoranu

          console.log(restaurantId)
          this.restaurantService.addWaiterToRestaurant(restaurantId, konobarUsername).subscribe(
            (msg)=>{
              console.log(msg)
              if(msg.code == 1){
                this.message = "Greska na serveru!";
                return;
              }else if(msg.code == 2){
                this.message = "Konobar je vec zaposlen negde!"
                return;
              }else if(msg.code == 3){
                this.message = "Nepostojeci restoran!"
                return;
              }
              this.message = "Uspešno dodavanje konobara!"
              this.ngOnInit()
            }
          )
        }
      }
    )
  }
}
