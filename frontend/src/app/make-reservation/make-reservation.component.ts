import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RestaurantService } from '../services/restaurant.service';
import { ActivatedRoute } from '@angular/router';
import { Shape } from '../models/shape';
import { Restaurant } from '../models/restaurant';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Reservation } from '../models/reservation';
import { User } from '../models/user';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-make-reservation',
  templateUrl: './make-reservation.component.html',
  styleUrls: ['./make-reservation.component.css']
})
export class MakeReservationComponent implements OnInit, AfterViewInit {
  @ViewChild('myCanvas', { static: false })
  canvas!: ElementRef;
  private ctx!: CanvasRenderingContext2D;

  reservations: Reservation[] = []
  reservationForm: FormGroup
  message:string = ""

  reservationDateTime:string = ""
  reservationNumOfPeople:number = 0

  id:string = ""
  restaurantLayout:Shape[] = []
  restaurant:Restaurant = new Restaurant()
  submited:boolean = false
  selectedTableId:string = ""

  constructor(private restaurantService:RestaurantService, private route: ActivatedRoute,
    private fb: FormBuilder, private userService:UserService){
      this.reservationForm = this.fb.group({
        date: ['', [Validators.required, this.minDateValidator()]],
        time: ['', [Validators.required, this.minTimeValidator()]]
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
      console.log(selectedDateTime)
      const currentDateTime = new Date();
      if (selectedDateTime < currentDateTime) {
        return { 'invalidTime': true };
      }
      return null;
    };
  }

  reservationMessage:string = ""

  async canMakeAReservation(){
    try {
      const user: User = await firstValueFrom(this.userService.getUserByUsername(JSON.parse(localStorage.getItem("user") || "").korIme));
      return user.strajk < 3;
    } catch (error) {
      console.error('Greška prilikom dohvatanja korisnika:', error);
      return false;
    }
  }

  async makeReservation(){
    const canReserve = await this.canMakeAReservation();
    if(!canReserve){
      this.reservationMessage = "Ne možete napraviti novu rezervaciju!"
      return
    }
    if(this.submited && this.selectedTableId != ""){
      const selectedTable = this.restaurantLayout.find(table => table?._id === this.selectedTableId);
      const userInput = prompt('Unesite broj ljudi za stolom:', '1');

      if (userInput === null) {
        return
      } else {
        const numberOfPeople = parseInt(userInput, 10);

        if (isNaN(numberOfPeople) || numberOfPeople <= 0) {
          this.reservationMessage = "Unos broja ljudi nije validan!"
          return
        }

        if(selectedTable && numberOfPeople > selectedTable?.brojLjudi){
          this.reservationMessage = "Izabrani sto se ne može rezervisati za taj broj ljudi!"
          return
        }

        const newReservation: Reservation = {
          _id:"",
          korIme: JSON.parse(localStorage.getItem("user") || "").korIme,
          restoranId: this.restaurant._id,
          uToku: true,
          komentar: "",
          ocena: 0,
          datumVreme: this.reservationDateTime,
          brojOsoba: numberOfPeople,
          opis: "",
          stoId:this.selectedTableId,
          pojavioSe:"",
          konobar:"",
          odbijanjeKom:"",
          produzetak:false
        };
        this.restaurantService.makeReservation(newReservation).subscribe(
          (reservation)=>{
            if(reservation){
              this.reservationMessage = 'Vaša rezervacija je uspešna!';
            }else{
              this.reservationMessage = 'Greska pri rezervaciji.';
            }
          }
        )

      }

    }else{
      this.reservationMessage = "Morate uneti sve potrebne podatke!"
    }
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['restaurantId']
    });

    this.restaurantService.getRestaurantLayout(this.id).subscribe(
      (layout)=>{
        this.restaurantLayout = layout
        this.drawShapes()
      }
    )

    this.restaurantService.getRestaurantById(this.id).subscribe(
      (rest)=>{
        this.restaurant = rest
      }
    )
  }

  showLayout(){
    this.message = ""
    if (this.reservationForm.valid) {
      const reservation = this.reservationForm.value;
      this.reservationDateTime = `${reservation.date}T${reservation.time}`
      //provera radnog vremena
      const date = new Date(this.reservationDateTime);
      const dayOfWeek = date.getDay();
      const dayOfWeekNumber = dayOfWeek === 0 ? 7 : dayOfWeek;

      if (this.restaurant && !this.restaurant.RadniDani[dayOfWeekNumber].radan) {
        this.message = 'Restoran ne radi tog dana.';
        return
      }
      const workingHours = this.restaurant.RadniDani[dayOfWeekNumber];
      const reservationTime = reservation.time;

      if (!(reservationTime >= workingHours.od && reservationTime <= workingHours.do)) {
        this.message = 'Restoran ne radi u tom periodu.';
        return
      }

      this.restaurantService.getReservationsForSpecificDateTime(this.restaurant._id, this.reservationDateTime).subscribe(
        (reservations)=>{
          this.reservations = reservations
          console.log(this.restaurantLayout)
          this.submited = true
          this.drawShapes()
        }
      )
    }else{
      this.message = "Morate uneti korektne podatke!"
    }

  }


  ngAfterViewInit(): void {
    if (this.canvas && this.canvas.nativeElement) {
      this.ctx = this.canvas.nativeElement.getContext('2d');
      this.setupCanvas();
    }
  }

  setupCanvas(): void {
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = 'black';

    this.canvas.nativeElement.addEventListener('mousedown', this.onMouseDown.bind(this));
  }

  onMouseDown(event: MouseEvent): void {
    if(this.submited){
      const rect = this.canvas.nativeElement.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      let clickedInsideCircle = false, clickedInsideRect = false;

      for (const shape of this.restaurantLayout) {
        if (shape?.type === 'circle') {
          this.ctx.beginPath();
          this.ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
          this.ctx.closePath();

          const reserved = this.reservations.some(reservation => reservation.stoId === shape._id && reservation.pojavioSe != 'F');

          if (this.ctx.isPointInPath(mouseX, mouseY)) {
            clickedInsideCircle = true;

            if (this.selectedTableId == "" && !reserved) {
              this.selectedTableId = shape._id;
            }
          }
        }else if (shape?.type == "rectangle"){
          if (mouseX >= shape.x && mouseX <= (shape.x + shape.width) &&
            mouseY >= shape.y && mouseY <= (shape.y + shape.height)) {
            clickedInsideRect = true;
          }
        }
      }

      if (!clickedInsideCircle && !clickedInsideRect) {
        this.selectedTableId = "";
      }

      this.drawShapes();
    }
  }

  drawShapes(): void {
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    for (const shape of this.restaurantLayout) {
      if (shape?.type === 'rectangle') {
        this.ctx.fillStyle = 'lightblue';
        this.ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = 'black';
        this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);

        if (shape.vrstaPravougaonika !== 0 && shape.vrstaPravougaonika !== null) {
          this.ctx.fillStyle = 'black';
          this.ctx.textAlign = 'center';
          this.ctx.textBaseline = 'middle';
          this.ctx.font = '16px Arial';
          this.ctx.fillText(shape.vrstaPravougaonika == 1?'Kuhinja':'Toalet', shape.x + shape.width/2, shape.y + shape.height/2);
        }
      } else if (shape?.type === 'circle') {
        const reserved = this.reservations.some(reservation => reservation.stoId === shape._id);

        if (this.selectedTableId === shape._id) {
          this.ctx.fillStyle = 'green';
        } else if (reserved) {
          this.ctx.fillStyle = 'red';
        } else {
          this.ctx.fillStyle = 'orange';
        }
        this.ctx.beginPath();
        this.ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = 'black';
        this.ctx.stroke();

        if (shape.brojLjudi !== undefined && shape.brojLjudi !== 0 && !reserved) {
          this.ctx.fillStyle = 'black';
          this.ctx.textAlign = 'center';
          this.ctx.textBaseline = 'middle';
          this.ctx.font = '16px Arial';
          this.ctx.fillText(shape.brojLjudi.toString(), shape.x, shape.y);
        }
      }
    }
  }

}
