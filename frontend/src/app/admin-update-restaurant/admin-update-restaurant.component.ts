import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Restaurant } from '../models/restaurant';
import { RestaurantService } from '../services/restaurant.service';

interface WorkingHours {
  [key: string]: { od: string; do: string; radan: boolean };
}

@Component({
  selector: 'app-admin-update-restaurant',
  templateUrl: './admin-update-restaurant.component.html',
  styleUrls: ['./admin-update-restaurant.component.css']
})
export class AdminUpdateRestaurantComponent implements OnInit {

  restaurantId: string = '';
  restaurant: Restaurant = new Restaurant();
  workingHoursForm: FormGroup;
  submitted = false;

  daysOfWeek = [
    { name: 'Ponedeljak', key: '1', isWorking: true },
    { name: 'Utorak', key: '2', isWorking: true },
    { name: 'Sreda', key: '3', isWorking: true },
    { name: 'Cetvrtak', key: '4', isWorking: true },
    { name: 'Petak', key: '5', isWorking: true },
    { name: 'Subota', key: '6', isWorking: true },
    { name: 'Nedelja', key: '7', isWorking: true }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private restaurantService: RestaurantService,
    private route: ActivatedRoute
  ) {
    this.workingHoursForm = this.formBuilder.group({
      days: this.formBuilder.group({})
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.restaurantId = params['restaurantId'];
      this.fetchRestaurantData(this.restaurantId);
    });

    const daysGroup = this.workingHoursForm.get('days') as FormGroup;

    this.daysOfWeek.forEach(day => {
      const startControl = this.formBuilder.control({ value: '', disabled: !day.isWorking }, Validators.required);
      const endControl = this.formBuilder.control({ value: '', disabled: !day.isWorking }, Validators.required);

      daysGroup.addControl(`${day.key}Start`, startControl);
      daysGroup.addControl(`${day.key}End`, endControl);
    });
  }

  fetchRestaurantData(restaurantId: string): void {
    this.restaurantService.getRestaurantById(restaurantId).subscribe(
      (rest: Restaurant) => {
        this.restaurant = rest;
        this.populateFormWithExistingData();
      },
      error => {
        console.error('Greška prilikom dohvatanja podataka o restoranu:', error);
      }
    );
  }

  populateFormWithExistingData(): void {
    const daysGroup = this.workingHoursForm.get('days') as FormGroup;

    this.daysOfWeek.forEach(day => {
      const startValue = this.restaurant.RadniDani[day.key]?.od || '';
      const endValue = this.restaurant.RadniDani[day.key]?.do || '';

      const startControl = this.formBuilder.control(startValue, Validators.required);
      const endControl = this.formBuilder.control(endValue, Validators.required);

      daysGroup.addControl(`${day.key}Start`, startControl);
      daysGroup.addControl(`${day.key}End`, endControl);
    });
  }

  toggleWorking(day: any): void {
    day.isWorking = !day.isWorking;

    const startControl = this.workingHoursForm.get(`days.${day.key}Start`);
    const endControl = this.workingHoursForm.get(`days.${day.key}End`);

    startControl?.[day.isWorking ? 'enable' : 'disable']();
    endControl?.[day.isWorking ? 'enable' : 'disable']();
  }

  onSubmit(): void {
    this.submitted = true;

    const formValues = this.workingHoursForm.value;
    const workingHours: WorkingHours = this.daysOfWeek.reduce((acc: WorkingHours, day) => {
      acc[day.key] = {
        od: formValues.days[`${day.key}Start`] || '00:00',
        do: formValues.days[`${day.key}End`] || '00:00',
        radan: true
      };
      if (!day.isWorking) {
        acc[day.key].radan = false;
      }
      return acc;
    }, {});

    console.log('RadniDani:', workingHours);

    this.restaurantService.updateRestaurantWorkingHours(this.restaurantId, workingHours)
      .subscribe(
        response => {
          console.log('Radno vreme restorana uspešno ažurirano:', response);
          this.fetchRestaurantData(this.restaurantId);
        },
        error => {
          console.error('Greška prilikom ažuriranja radnog vremena restorana:', error);
        }
      );
  }
}
