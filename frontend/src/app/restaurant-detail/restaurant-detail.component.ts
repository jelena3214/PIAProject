import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestaurantService } from '../services/restaurant.service';
import { Restaurant } from '../models/restaurant';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { Reservation } from '../models/reservation';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Comment {
  id: number;
  author: string;
  text: string;
}

@Component({
  selector: 'app-restaurant-detail',
  templateUrl: './restaurant-detail.component.html',
  styleUrls: ['./restaurant-detail.component.css']
})
export class RestaurantDetailComponent implements OnInit {
  restaurant: Restaurant | undefined;
  reservations: Reservation[] = []
  reservationForm: FormGroup
  message:string = ""

  constructor(
    private route: ActivatedRoute,
    private restaurantService: RestaurantService,
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.reservationForm = this.fb.group({
      date: ['', [Validators.required, this.minDateValidator()]],
      time: ['', [Validators.required, this.minTimeValidator()]],
      numberOfPeople: ['', [Validators.required, Validators.min(1)]],
      additionalRequests: ['']
    });
  }

  minDateValidator() {
    return (control: { value: string | number | Date; }) => {
      const selectedDate = new Date(control.value);
      const currentDate = new Date();
      if (selectedDate < currentDate) {
        return { 'invalidDate': true };
      }
      return null;
    };
  }

  minTimeValidator() {
    return (control: { value: any; }) => {
      const selectedDate = this.reservationForm?.get('date')?.value;
      if (!selectedDate) return null;

      const selectedDateTime = new Date(`${selectedDate}T${control.value}`);
      const currentDateTime = new Date();
      if (selectedDateTime < currentDateTime) {
        return { 'invalidTime': true };
      }
      return null;
    };
  }



  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.restaurantService.getRestaurantById(id).subscribe(data => {
      this.restaurant = data;
      console.log(this.restaurant?.Adresa)
      this.initMap(this.restaurant?.Adresa || "");
    });
    this.restaurantService.getRestaurantReservationsById(id).subscribe(
      (reservations)=>{
        this.reservations = reservations
      }
    )
  }

  //https://www.here.com/docs/bundle/getting-here-credentials/page/README.html nekasifra1
  apiKey:string = "lsMYIkh6xEjPI2RCPNiJH3dQu9ouiQkQAGPDl7Y7MNM"

  initMap(address: string) {
    const apiUrl = `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(address)}&apiKey=${this.apiKey}`;

    this.http.get(apiUrl).subscribe((data: any) => {
      if (data && data.items && data.items.length > 0) {
        const location = data.items[0].position; // Dobijamo poziciju lokacije
        const latitude = location.lat;
        const longitude = location.lng;
        let mymap = L.map('map').setView([latitude, longitude], 13);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(mymap);

        L.marker([latitude, longitude]).addTo(mymap);
        console.log('Latitude:', latitude);
        console.log('Longitude:', longitude);
      } else {
        console.error('Nema rezultata za datu adresu.');
      }
    }, (error) => {
      console.error('Greška prilikom dobijanja koordinata:', error);
    });
  }

  submitReservation(): void {
    if (this.reservationForm.valid) {
      const reservation = this.reservationForm.value;
      const reservationDateTime = new Date(`${reservation.date}T${reservation.time}`);
      const dayOfWeek = reservationDateTime.getDay();
      const dayOfWeekNumber = dayOfWeek === 0 ? 7 : dayOfWeek;

      if (this.restaurant && this.restaurant.RadniDani[dayOfWeekNumber]) {
        const workingHours = this.restaurant.RadniDani[dayOfWeekNumber];
        const reservationTime = reservation.time;

        if (reservationTime >= workingHours.od && reservationTime <= workingHours.do) {
          const availableTables = this.restaurant.Stolovi.filter(table => table.maksimalanBrojLjudi >= reservation.numberOfPeople);
          if (availableTables.length > 0) {
            const newReservation: Reservation = {
              korIme: JSON.parse(localStorage.getItem("user") || "").korIme,
              restoranId: this.restaurant._id,
              uToku: true,
              komentar: "",
              ocena: 0,
              datumVreme: reservationDateTime,
              brojOsoba: reservation.numberOfPeople,
              opis: reservation.additionalRequests
            };
            this.restaurantService.makeReservation(newReservation).subscribe(
              (reservation)=>{
                if(reservation){
                  this.message = 'Vaša rezervacija je uspešna!';
                }else{
                  this.message = 'Greska pri rezervaciji.';
                }
              }
            )
          } else {
            this.message = 'Nema slobodnih mesta za traženi broj ljudi i termin.';
          }
        } else {
          this.message = 'Restoran ne radi u tom periodu.';
        }
      } else {
        this.message = 'Restoran ne radi tog dana.';
      }
    } else {
      this.message = 'Molimo Vas da popunite sta polja ispravno.';
    }
  }
}
