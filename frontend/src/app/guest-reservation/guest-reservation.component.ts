import { Component, OnInit } from '@angular/core';
import { Reservation } from '../models/reservation';
import { RestaurantService } from '../services/restaurant.service';
import { GuestService } from '../services/guest.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-guest-reservation',
  templateUrl: './guest-reservation.component.html',
  styleUrls: ['./guest-reservation.component.css'],
  providers: [DatePipe]
})
export class GuestReservationComponent implements OnInit{
  currentReservations: Reservation[] = [];
  pastReservations: Reservation[] = [];
  restaurantsMap: { [key: string]: { naziv: string, adresa: string } } = {};
  reservations:Reservation[] = []

  selectedReservation: Reservation | null = null;
  komentar: string = '';
  ocena: number = 0;
  stars: boolean[] = [true, true, true, true, true];

  constructor(private restaurantService: RestaurantService, private guestService:GuestService, private datePipe: DatePipe) {}

  ngOnInit() {
    this.loadAllRestaurants();
    this.guestService.getAllReservations(JSON.parse(localStorage.getItem("user") || "").korIme).subscribe(
      (reservations)=>{
        if(reservations){
          this.reservations = reservations
          this.filterReservations()
        }
      }
    )
  }

  setRating(rating: number) {
    this.ocena = rating;
  }

  loadAllRestaurants() {
    this.restaurantService.getAllRestaurants().subscribe(restaurants => {
      restaurants.forEach(rest => {
        this.restaurantsMap[rest._id] = { naziv: rest.Naziv, adresa: rest.Adresa };
      });
    });
  }

  // Jer ako je ovo Z ne prikazuje trenutnu vremensku zonu
  formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return this.datePipe.transform(date, 'dd/MM/yyyy HH:mm') || "";
  }

  filterReservations() {
    //potvrdjene rezervacije u buducnosti
    this.currentReservations = this.reservations.filter(reservation =>
      !reservation.uToku &&
      reservation.konobar !== "" &&
      new Date(reservation.datumVreme) > new Date()
    );
    console.log(this.currentReservations)

    //sve rezervacije u proslosti i otkazane rezervacije
    this.pastReservations = this.reservations.filter(reservation => new Date(reservation.datumVreme) < new Date() || !reservation.uToku)
      .sort((a, b) => new Date(b.datumVreme).getTime() - new Date(a.datumVreme).getTime());
  }

  getRestaurantName(restoranId: string): string {
    return this.restaurantsMap[restoranId]?.naziv || 'Nepoznat';
  }

  getRestaurantAddress(restoranId: string): string {
    return this.restaurantsMap[restoranId]?.adresa || 'Nepoznata';
  }

  canCancelReservation(reservation: Reservation): boolean {
    const now = new Date();
    const reservationTime = new Date(reservation.datumVreme);
    const timeDifference = reservationTime.getTime() - now.getTime();
    return timeDifference >= 45 * 60 * 1000;
  }

  cancelReservation(reservation: Reservation) {
    this.restaurantService.cancelReservation(reservation._id).subscribe(
      (updatedReservation) => {
        console.log(updatedReservation)
        reservation = updatedReservation
        this.filterReservations();
        this.ngOnInit()
      },
      error => {
        console.error('Error cancelling reservation:', error);
      }
    );
  }

  canRateReservation(reservation: Reservation): boolean {
    return reservation.pojavioSe=="T" && !reservation.komentar && reservation.ocena === 0;
  }

  openRatingForm(reservation: Reservation) {
    this.selectedReservation = reservation;
    this.komentar = '';
    this.ocena = 0;
  }

  submitRating() {
    if (this.selectedReservation) {
      this.selectedReservation.komentar = this.komentar;
      this.selectedReservation.ocena = this.ocena;

      this.restaurantService.updateReservation(this.selectedReservation).subscribe(
        updatedReservation => {
          this.filterReservations();
          this.selectedReservation = null;
        },
        error => {
          console.log('Error updating reservation:', error);
        }
      );
    }
  }

}
