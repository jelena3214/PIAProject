import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { WaiterService } from '../services/waiter.service';
import { Restaurant } from '../models/restaurant';
import { User } from '../models/user';
import { Reservation } from '../models/reservation';
import { RestaurantService } from '../services/restaurant.service';
import { DatePipe } from '@angular/common';
import { Shape } from '../models/shape';
import { GuestService } from '../services/guest.service';

@Component({
  selector: 'app-waiter-reservations',
  templateUrl: './waiter-reservations.component.html',
  styleUrls: ['./waiter-reservations.component.css'],
  providers: [DatePipe]
})
export class WaiterReservationsComponent implements OnInit, AfterViewInit{
  @ViewChild('myCanvas', { static: false })
  canvas!: ElementRef;
  private ctx!: CanvasRenderingContext2D;

  restaurant:Restaurant = new Restaurant()
  restaurantLayout:Shape[] = []
  reservedTables:Reservation[] = []
  allReservations:Reservation[] = []

  waiter:User = new User()
  currentReservations:Reservation[] = []
  confirmedReservations:Reservation[] = []

  selectedReservation:Reservation | null = null
  selectedTableId:string = ""
  selectedTablePeopleCnt:number = 0

  action: string = 'confirm';
  comment: string = '';

  message:string = ""

  constructor(private waiterService: WaiterService, private restaurantService:RestaurantService, private datePipe: DatePipe,
    private guestService:GuestService
  ){}

  ngOnInit(): void {
    this.waiter = JSON.parse(localStorage.getItem("user") || "");
    this.waiterService.getRestoranByWaiterId(this.waiter._id).subscribe(
      (rest)=>{
        if(rest){
          this.restaurant = rest
          console.log(rest)
          this.restaurantService.getRestaurantReservationsById(this.restaurant._id).subscribe(
            (reserv)=>{
              this.allReservations = reserv;
              console.log(this.allReservations)
              this.filterAndSortReservations()
            }
          )
          this.restaurantService.getRestaurantLayout(this.restaurant._id).subscribe(
            (layout)=>{
              this.restaurantLayout = layout
            }
          )
        }
      }
    )
  }

  filterAndSortReservations() {
    this.currentReservations = this.allReservations
      .filter(reservation => reservation.uToku)
      .sort((a, b) => new Date(a.datumVreme).getTime() - new Date(b.datumVreme).getTime());

    this.confirmedReservations = this.allReservations
      .filter(reservation => reservation.uToku == false && reservation.konobar == this.waiter._id && reservation.odbijanjeKom == "")
      .sort((a, b) => new Date(a.datumVreme).getTime() - new Date(b.datumVreme).getTime());
  }

  isFutureReservation(reservationDate: string | Date): boolean {
    return new Date(reservationDate) > new Date();
  }

  confirmGuestAppearance(reservation: Reservation, status:string) {
    reservation.pojavioSe = status
    this.waiterService.updateReservation(reservation).subscribe(
      (updatedReservation) => {
        if(status == 'F'){
          this.guestService.strikeGuest(reservation.korIme).subscribe(
            (guest)=>{
              if(guest){
                this.message = "Uspešno potvrđeno"
              }else{
                this.message = "Greška pri potvrđivanju"
              }
            }
          )
        }
      },
      (error) => {
        this.message = "Greška pri potvrđivanju"
      }
    );
  }

  canExtendReservation(reservation: Reservation): boolean {
    const reservationEndTime = new Date(reservation.datumVreme);
    reservationEndTime.setHours(reservationEndTime.getHours() + 3);

    const extendedEndTime = new Date(reservationEndTime);
    extendedEndTime.setHours(extendedEndTime.getHours() + 1);

    return !this.allReservations.some(r =>
      r.stoId === reservation.stoId &&
      r._id !== reservation._id &&
      new Date(r.datumVreme) < extendedEndTime && // provera da li pocinje pre isteka dodatnog sata
      new Date(r.datumVreme) >= reservationEndTime // provera da li pocinje posle trenutne rezervacije
    );
  }

  canAddOneHour(reservation:Reservation){
    const now = new Date();
    const reservationTime = new Date(reservation.datumVreme);
    const threeHoursFromReservation = new Date(reservationTime.getTime() + 3 * 60 * 60 * 1000);
    return reservation.pojavioSe == 'T' && reservationTime < now && now <= threeHoursFromReservation
  }

  addOneHour(reservation:Reservation){
    if(!this.canExtendReservation(reservation)){
      this.message = "Ne možete produžiti termin, jer postoji rezervacija nakon."
      return
    }
    if(reservation.produzetak){
      this.message = "Možete samo jednom produžiti termin!"
      return
    }
    reservation.produzetak = true
    this.waiterService.updateReservation(reservation).subscribe(
      (updatedReservation) => {
        this.message = "Uspešno produžen termin"
      },
      (error) => {
        this.message = "Greška pri produžavanju termina"
      }
    );
  }

  isConfirmationAvailable(reservation: Reservation): boolean {
    const reservationTime = new Date(reservation.datumVreme).getTime();
    const currentTime = new Date().getTime();
    // Provera da li je trenutno vreme unutar 30 minuta nakon vremena rezervacije
    const isWithin30MinutesAfterReservation = currentTime >= reservationTime && currentTime <= reservationTime + 30 * 60 * 1000;
    return isWithin30MinutesAfterReservation && reservation.pojavioSe === "";
  }

  // Jer ako je ovo Z ne prikazuje trenutnu vremensku zonu
  formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return this.datePipe.transform(date, 'dd/MM/yyyy HH:mm') || "";
  }

  openReservationForm(reservation: Reservation) {
    this.selectedReservation = reservation;
    if(this.selectedReservation.stoId == ""){
      this.restaurantService.getReservationsForSpecificDateTime(this.restaurant._id, this.selectedReservation.datumVreme).subscribe(
        (reser)=>{
          if(reser){
            this.reservedTables = reser
          }
        }
      )
    }
    this.drawShapes()
  }

  confirmed:boolean = false
  denied:boolean = false

  checkIfTableSizeIsEnough(stoId: string, numOfPeopleReserv: number): boolean {
    const shape = this.restaurantLayout.find(shape => shape?._id === stoId);
    if (!shape) {
      return false; // Shape nije pronađen
    }
    return shape.brojLjudi >= numOfPeopleReserv;
  }

  submitReservation() {
    if (this.action === 'reject' && !this.comment.trim()) {
      alert('Komentar je obavezan ako odbijate rezervaciju.');
      return;
    }
    if(this.selectedReservation){
      if (this.action === 'confirm') {
        //dodaje se konobarId, uToku false i stoId ako je preko forme
        console.log(this.selectedTablePeopleCnt)
        this.selectedReservation.konobar = this.waiter._id
        this.selectedReservation.uToku = false
        if(this.selectedTableId != ""){ // preko forme rezervisano
          this.selectedReservation.stoId = this.selectedTableId
        }
        if(!this.checkIfTableSizeIsEnough(this.selectedReservation.stoId, this.selectedReservation.brojOsoba)){
          alert('Sto nije dovoljan za traženi broj ljudi.');
          this.selectedReservation.stoId = ""
          return;
        }
        this.waiterService.updateReservation(this.selectedReservation).subscribe(
          (updatedReservation) => {
            console.log('Updated reservation:', updatedReservation);
          },
          (error) => {
            console.error('Error updating reservation:', error);
          }
        );
        this.confirmed = true

      } else {
        //odbijanjeKom dobija i uToku false
        this.selectedReservation.odbijanjeKom = this.comment
        this.selectedReservation.uToku = false
        this.waiterService.updateReservation(this.selectedReservation).subscribe(
          (updatedReservation) => {
            console.log('Updated reservation:', updatedReservation);
          },
          (error) => {
            console.error('Error updating reservation:', error);
          }
        );
        this.denied = true
      }
    }

    this.drawShapes()
    this.action = 'confirm';
    this.comment = '';
  }

  isTableReserved(tableId: string): boolean {
    return this.reservedTables.some(reservation => reservation.stoId === tableId);
  }


  ngAfterViewInit(): void {
    console.log(this.canvas)
    console.log(this.ctx)
    if (this.canvas && this.canvas.nativeElement) {
      this.ctx = this.canvas.nativeElement.getContext('2d');
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = 'black';
    }

    this.canvas.nativeElement.addEventListener('mousedown', this.onMouseDown.bind(this));
  }

  onMouseDown(event: MouseEvent): void {
    if(this.selectedReservation && this.selectedReservation.stoId == ""){
      const rect = this.canvas.nativeElement.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      for (const shape of this.restaurantLayout) {
        if (shape?.type === 'circle') {
          this.ctx.beginPath();
          this.ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
          this.ctx.closePath();

          const reserved = this.reservedTables.some(reservation => reservation.stoId === shape._id);

          if (this.ctx.isPointInPath(mouseX, mouseY)) {
            if (!reserved) {
              this.selectedTableId = shape._id;
              this.selectedTablePeopleCnt = shape.brojLjudi
              break;
            }
          }
        }
      }
      this.drawShapes();
    }
  }

  drawShapes(): void {
    if (this.ctx && this.selectedReservation) {
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
          console.log(this.selectedReservation.stoId)
          if (this.selectedReservation?.stoId == shape._id) {
            if(!this.confirmed && !this.denied)this.ctx.fillStyle = 'yellow';
            else if(this.confirmed)this.ctx.fillStyle = 'red';
            else if(this.denied)this.ctx.fillStyle = 'white';
          }else if(this.selectedTableId == shape._id  && this.confirmed) {
            this.ctx.fillStyle = 'red';
          }else if(this.selectedTableId == shape._id) {
            this.ctx.fillStyle = 'yellow';
          }else{
            this.ctx.fillStyle = 'white';
          }
          this.ctx.beginPath();
          this.ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
          this.ctx.closePath();
          this.ctx.fill();

          this.ctx.lineWidth = 2;
          this.ctx.strokeStyle = 'black';
          this.ctx.stroke();

          if (shape.brojLjudi !== undefined && shape.brojLjudi !== 0) {
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

}
