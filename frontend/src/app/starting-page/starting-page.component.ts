import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { HttpClient } from '@angular/common/http';
import { Restaurant } from '../models/restaurant';
import { GuestService } from '../services/guest.service';
import { RestaurantService } from '../services/restaurant.service';

@Component({
  selector: 'app-starting-page',
  templateUrl: './starting-page.component.html',
  styleUrls: ['./starting-page.component.css']
})
export class StartingPageComponent {
  numberOfRestaurants: number = 0;
  numberOfGuests: number = 0;
  restaurantInfo: Restaurant[] = [];
  filteredRestaurants: Restaurant[] = [];
  name:string = ""
  address:string = ""
  type:string = ""


  constructor(private http: HttpClient, private guestService:GuestService, private restaurantService:RestaurantService) { }

  ngOnInit(): void {
    this.guestService.getNumberOfGuests().subscribe(
      (number)=>{
        if(number){
          console.log(number)
          this.numberOfGuests = number
        }
      }
    )

    this.restaurantService.getNumberOfRestaurants().subscribe(
      (number)=>{
        if(number){
          this.numberOfRestaurants = number
        }
      }
    )

    this.restaurantService.getAllRestaurants().subscribe(
      (restaurants)=>{
        if(restaurants){
          this.restaurantInfo = restaurants
          this.filteredRestaurants = restaurants
        }
      }
    )
  }

  searchRestaurants() {
    this.filteredRestaurants = this.restaurantInfo.filter(restaurant => {
      const nazivLower = restaurant.Naziv.toLowerCase();
      const adresaLower = restaurant.Adresa.toLowerCase();
      const tipLower = restaurant.Tip.toLowerCase();
      const searchNameLower = this.name.toLowerCase();
      const searchAddressLower = this.address.toLowerCase();
      const searchTypeLower = this.type.toLowerCase();

      const isNameMatch = this.name.trim() === '' || nazivLower.includes(searchNameLower);
      const isAddressMatch = this.address.trim() === '' || adresaLower.includes(searchAddressLower);
      const isTypeMatch = this.type.trim() === '' || tipLower.includes(searchTypeLower);

      return isNameMatch && isAddressMatch && isTypeMatch;
    })
  }

  currentSortDirection: { [key: string]: string } = {
    'Naziv': 'asc',
    'Adresa': 'asc',
    'Tip': 'asc'
  };

  sort(key: string): void {
    this.currentSortDirection[key] = this.currentSortDirection[key] === 'asc' ? 'desc' : 'asc';

    this.filteredRestaurants.sort((a, b) => {
        let valA
        let valB
        if(key == "adresa"){
          valA = a.Adresa.toLowerCase();
          valB = b.Adresa.toLowerCase();
        }else if(key == "naziv"){
          valA = a.Naziv.toLowerCase();
          valB = b.Naziv.toLowerCase();
        }else{
          valA = a.Tip.toLowerCase();
          valB = b.Tip.toLowerCase();
        }
        if (valA < valB) return this.currentSortDirection[key] === 'asc' ? -1 : 1;
        if (valA > valB) return this.currentSortDirection[key] === 'asc' ? 1 : -1;
        return 0;
    });
  }


  // sortPredmet(){
  //   this.predmetiNastavnici.sort((a, b) => {
  //     const predmetA = a.predmet.toLowerCase();
  //     const predmetB = b.predmet.toLowerCase();
  //     return predmetA.localeCompare(predmetB);
  //   });
  // }

  // sortIme(){
  //   this.predmetiNastavnici.forEach(predmet => {
  //     predmet.nastavnici.sort((a: { ime: string; prezime:string;}, b: { ime: string; prezime:string;}) => {
  //       const imeA = a.ime.toLowerCase();
  //       const imeB = b.ime.toLowerCase();
  //       return imeA.localeCompare(imeB);
  //     });
  //   });
  // }

  // sortPrezime(){
  //   this.predmetiNastavnici.forEach(predmet => {
  //     predmet.nastavnici.sort((a: { ime: string; prezime:string;}, b: { ime: string; prezime:string;}) => {
  //       const A = a.prezime.toLowerCase();
  //       const B = b.prezime.toLowerCase();
  //       return A.localeCompare(B);
  //     });
  //   });
  // }

  // ime:string = ""
  // prezime:string = ""
  // predmet:string = ""

  // pretraziNastavnike() {
  //   return this.predmetiNastavnici.filter(item => {
  //     const imeMatch = this.ime ? item.nastavnici.some((nastavnik: { ime: string; prezime:string;}) => nastavnik.ime.toLowerCase().includes(this.ime.toLowerCase())) : true;
  //     const prezimeMatch = this.prezime ? item.nastavnici.some((nastavnik: { ime:string; prezime: string; }) => nastavnik.prezime.toLowerCase().includes(this.prezime.toLowerCase())) : true;
  //     const predmetMatch = this.predmet ? item.predmet.toLowerCase().includes(this.predmet.toLowerCase()) : true;
  //     return imeMatch && prezimeMatch && predmetMatch;
  //   });
  // }


}
