import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestaurantService } from '../services/restaurant.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Dish } from '../models/dish';

@Component({
  selector: 'app-add-dishes',
  templateUrl: './add-dishes.component.html',
  styleUrls: ['./add-dishes.component.css']
})
export class AddDishesComponent implements OnInit{


  dishesForm: FormGroup;

  constructor(private restaurantService:RestaurantService, private route: ActivatedRoute, private fb: FormBuilder){
    this.dishesForm = this.fb.group({
      dishes: this.fb.array([])
    });
  }

  restaurantId:string = ""
  message:string = ""

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.restaurantId = params['restaurantId']
    });
    this.addDish()
  }


  get dishes() {
    return this.dishesForm.get('dishes') as FormArray;
  }

  addDish() {
    const dishFormGroup = this.fb.group({
      name: ['', Validators.required],
      price: [0, Validators.min(0)],
      ingredients: this.fb.array([]),
      image: [null, Validators.required]
    });

    this.dishes.push(dishFormGroup);
  }

  removeDish(index: number) {
    this.dishes.removeAt(index);
  }

  getIngredients(dishIndex: number) {
    return (this.dishes.at(dishIndex).get('ingredients') as FormArray).controls;
  }

  addIngredient(dishIndex: number) {
    this.getIngredients(dishIndex).push(this.fb.control(''));
  }

  removeIngredient(dishIndex: number, ingredientIndex: number) {
    const ingredientsArray = this.dishes.at(dishIndex).get('ingredients') as FormArray;
    ingredientsArray.removeAt(ingredientIndex);
  }

  onFileChange(event: Event, dishIndex: number) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.dishes.at(dishIndex).patchValue({ image: file });
    }
  }


  submitForm() {
    if (this.dishesForm.valid) {
      const formData = new FormData();
      const dishesData = this.dishesForm.getRawValue().dishes.map((dish: any) => {
        // Filtriraj prazne sastojke ako postoje
        const ingredients = dish.ingredients?.filter((ingredient: string) => ingredient.trim() !== '') || [];

        return {
          name: dish.name,
          price: dish.price,
          ingredients: ingredients
        };
      });

      formData.append('restaurantId', this.restaurantId);
      formData.append('dishesData', JSON.stringify(dishesData));

      this.dishesForm.getRawValue().dishes.forEach((dish: any) => {
        if (dish.image) {
          formData.append('images', dish.image);
        }
      });

      this.restaurantService.saveDishes(formData).subscribe(
        (response) => {
          if(response.code == 0) {
            this.message = "Podaci uspešno poslati na server."
            return
          }
        },
        (error) => {
          this.message = 'Greška prilikom slanja podataka na server.'
          return;
        }
      );
    } else {
      this.message = 'Forma nije validna. Molimo vas da popunite sva obavezna polja.'
    }
  }



}
