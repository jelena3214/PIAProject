import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestaurantService } from '../services/restaurant.service';
import { Restaurant } from '../models/restaurant';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';

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

  comments: Comment[] = [
    { id: 1, author: 'John Doe', text: 'Lorem ipsum dolor sit amet.' },
    { id: 2, author: 'Jane Smith', text: 'Consectetur adipiscing elit.' },
    { id: 3, author: 'Alice Johnson', text: 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.' },
    { id: 4, author: 'Bob Brown', text: 'Nullam id dolor id nibh ultricies vehicula ut id elit.' }
  ];

  constructor(
    private route: ActivatedRoute,
    private restaurantService: RestaurantService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.restaurantService.getRestaurantById(id).subscribe(data => {
      this.restaurant = data;
      console.log(this.restaurant?.Adresa)
      this.initMap(this.restaurant?.Adresa || "");
    });
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
}
