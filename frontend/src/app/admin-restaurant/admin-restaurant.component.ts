import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Restaurant } from '../models/restaurant';
import { RestaurantService } from '../services/restaurant.service';
import { Shape } from '../models/shape';

@Component({
  selector: 'app-admin-restaurant',
  templateUrl: './admin-restaurant.component.html',
  styleUrls: ['./admin-restaurant.component.css']
})
export class AdminRestaurantComponent implements OnInit, AfterViewInit {
  @ViewChild('myCanvas', { static: false })
  canvas!: ElementRef;
  private ctx!: CanvasRenderingContext2D;
  private shapes: Shape[] = [];

  private drawingShape: Shape = null;
  private isDrawing = false;
  message:string = ""
  filemessage = ""
  name:string = ""
  address:string = ""
  type:string = ""
  phone:string = ""
  description:string = ""
  allRestaurants:Restaurant[] = []

  constructor(private restaurantService:RestaurantService) {}

  ngOnInit(): void {
    this.restaurantService.getAllRestaurants().subscribe(
      (rest)=>{
        this.allRestaurants = rest
      }
    )
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
    this.canvas.nativeElement.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.canvas.nativeElement.addEventListener('mouseup', this.onMouseUp.bind(this));
  }

  onMouseDown(event: MouseEvent): void {
    this.isDrawing = true;
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    if (event.shiftKey) {
      this.drawingShape = {
        type: 'rectangle',
        x: mouseX,
        y: mouseY,
        width: 0,
        height: 0,
        radius:0,
        brojLjudi:0,
        vrstaPravougaonika:0,
        _id : ""
      };
    } else {
      this.drawingShape = {
        type: 'circle',
        x: mouseX,
        y: mouseY,
        radius: 0,
        width:0,
        height:0,
        brojLjudi:0,
        vrstaPravougaonika:0,
        _id : ""
      };
    }

    if (event.ctrlKey) {
      const rect = this.canvas.nativeElement.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      // Prover a kliknutih oblika unutar canvas-a
      for (let i = this.shapes.length - 1; i >= 0; i--) {
        const shape = this.shapes[i];
        if (shape?.type === 'rectangle') {
          if (mouseX >= shape.x && mouseX <= shape.x + shape.width &&
              mouseY >= shape.y && mouseY <= shape.y + shape.height) {
            this.shapes.splice(i, 1);
          }
        } else if (shape?.type === 'circle') {
          const dx = mouseX - shape.x;
          const dy = mouseY - shape.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance <= shape.radius) {
            this.shapes.splice(i, 1);
          }
        }
      }
      this.drawingShape = null
    }

    this.drawShapes();
  }


  onMouseMove(event: MouseEvent): void {
    if (!this.isDrawing || !this.drawingShape) {
      return;
    }

    const rect = this.canvas.nativeElement.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    if (this.drawingShape.type === 'rectangle') {
      this.drawingShape.width = mouseX - this.drawingShape.x;
      this.drawingShape.height = mouseY - this.drawingShape.y;
    } else if (this.drawingShape.type === 'circle') {
      const dx = mouseX - this.drawingShape.x;
      const dy = mouseY - this.drawingShape.y;
      this.drawingShape.radius = Math.sqrt(dx * dx + dy * dy);
    }

    this.drawShapes();
  }

  onMouseUp(event: MouseEvent): void {
    if (!this.isDrawing || !this.drawingShape) {
      return;
    }

    let add = true

    if(this.drawingShape.type == 'circle'){
      const userInput = prompt('Unesite maksimalan broj ljudi za stolom:', '1');
      const number = userInput !== null ? parseInt(userInput, 10) : 1;
      this.drawingShape.brojLjudi = number
    }else{
      const userInput = prompt('Unesite vrstu pravougaonika: 1-Kuhinja, 2-Toalet:', '1');
      const number = userInput !== null ? parseInt(userInput, 10) : 0;
      if(number != 1 && number != 2){
        add = false
      }
      this.drawingShape.vrstaPravougaonika = number
    }

    if(add)this.shapes.push(this.drawingShape);
    this.drawingShape = null;
    this.isDrawing = false;

    this.drawShapes();
  }

  drawShapes(): void {
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    for (const shape of this.shapes) {
      if (shape?.type === 'rectangle') {
        this.ctx.fillStyle = 'lightblue';
        this.ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
        if (shape.vrstaPravougaonika !== 0 && shape.vrstaPravougaonika !== null) {
          this.ctx.fillStyle = 'black';
          this.ctx.textAlign = 'center';
          this.ctx.textBaseline = 'middle';
          this.ctx.font = '16px Arial';
          this.ctx.fillText(shape.vrstaPravougaonika == 1?'Kuhinja':'Toalet', shape.x + shape.width/2, shape.y + shape.height/2);
        }
      } else if (shape?.type === 'circle') {
        this.ctx.fillStyle = 'orange';
        this.ctx.beginPath();
        this.ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
        this.ctx.closePath();
        this.ctx.fill();

        if (shape.brojLjudi !== undefined && shape.brojLjudi !== null) {
          this.ctx.fillStyle = 'black';
          this.ctx.textAlign = 'center';
          this.ctx.textBaseline = 'middle';
          this.ctx.font = '16px Arial';
          this.ctx.fillText(shape.brojLjudi.toString(), shape.x, shape.y);
        }
      }
    }

    if (this.isDrawing && this.drawingShape) {
      if (this.drawingShape.type === 'rectangle') {
        this.ctx.fillStyle = 'lightblue';
        this.ctx.fillRect(this.drawingShape.x, this.drawingShape.y, this.drawingShape.width, this.drawingShape.height);
      } else if (this.drawingShape.type === 'circle') {
        this.ctx.fillStyle = 'orange';
        this.ctx.beginPath();
        this.ctx.arc(this.drawingShape.x, this.drawingShape.y, this.drawingShape.radius, 0, Math.PI * 2);
        this.ctx.closePath();
        this.ctx.fill();
      }
    }
  }

  addedRestaurant:string = ""

  removeIdField(shapes: any[]): any[] {
    return shapes.map(({ _id, ...rest }) => rest);
  }

  addRestaurant(){
    if(!this.validateAndClear())return;

    if(this.name.length == 0 || this.address.length == 0){
      this.message = "Morate popuniti sva polja!"
      return
    }

    const phoneRegex = /^\+3816\d{8,9}$/;
    if(!phoneRegex.test(this.phone)){
      this.message = "Telefon nije u dobrom formatu!"
      return
    }

    const newRestaurant = {
      Adresa: this.address,
      Tip :this.type,
      Naziv: this.name,
      Opis : this.description,
      ProsecnaOcena : 0,
      Konobari : [],
      Telefon : this.phone,
      RadniDani : {
        "1": { od: "08:00", do: "22:00" },
        "2": { od: "08:00", do: "22:00" },
        "3": { od: "08:00", do: "22:00" },
        "4": { od: "08:00", do: "22:00" },
        "5": { od: "08:00", do: "22:00" },
        "6": { od: "08:00", do: "22:00" },
        "7": { od: "08:00", do: "22:00" }
      }
    }
    // zbog nodejsa ne smemo slati prazan id
    const shapesWithoutId = this.removeIdField(this.shapes);

    this.restaurantService.addRestaurant(newRestaurant, shapesWithoutId).subscribe(
      (msg) => {
        if(msg.code == 0){
          this.message = "Uspešno dodat restoran!"
          this.addedRestaurant = msg.mess
        }else{
          this.message = "Greška pri unosu restorana!"
        }
      }
    );
  }

  validateAndClear(): boolean {
    // Provera minimalnog broja oblika
    let kitchenNum = 0;
    let toiletNum = 0;
    let circleCount = 0;

    for (const shape of this.shapes) {
      if (shape?.type === 'rectangle') {
        if(shape.vrstaPravougaonika == 1)kitchenNum++;
        if(shape.vrstaPravougaonika == 2)toiletNum++;
      } else if (shape?.type === 'circle') {
        circleCount++;
      }
    }

    if (kitchenNum < 1 || toiletNum < 1 || circleCount < 3) {
      this.message = 'Morate imati minimalno 1 kuhinju, 1 toalet i 3 stola.';
      return false;
    }

    // Provera preklapanja oblika
    for (let i = 0; i < this.shapes.length; i++) {
      const shapeA = this.shapes[i];
      for (let j = i + 1; j < this.shapes.length; j++) {
        const shapeB = this.shapes[j];
        if (this.checkOverlap(shapeA, shapeB)) {
          this.message = 'Oblici se ne smeju preklapati.';
          this.clearCanvas();
          return false;
        }
      }
    }

    this.message = "Uspešno iscrtano!"
    return true;
  }

  checkOverlap(shapeA: Shape, shapeB: Shape): boolean {
    if (!shapeA || !shapeB) {
      return false;
    }

    if (shapeA.type === 'rectangle' && shapeB.type === 'rectangle') {
      return !(
        shapeA.x + shapeA.width < shapeB.x ||
        shapeB.x + shapeB.width < shapeA.x ||
        shapeA.y + shapeA.height < shapeB.y ||
        shapeB.y + shapeB.height < shapeA.y
      );
    } else if (shapeA.type === 'circle' && shapeB.type === 'circle') {
      const dx = shapeA.x - shapeB.x;
      const dy = shapeA.y - shapeB.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < shapeA.radius + shapeB.radius;
    } else {
      // Pravougaonik i krug
      const rect = shapeA.type === 'rectangle' ? shapeA : shapeB;
      const circle = shapeA.type === 'circle' ? shapeA : shapeB;

      // Prvo proveravamo da li je centar kruga unutar pravougaonika
      const circleX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
      const circleY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));

      const dx = circleX - circle.x;
      const dy = circleY - circle.y;
      return (dx * dx + dy * dy) < (circle.radius * circle.radius);
    }
  }

  clearCanvas(): void {
    this.shapes = [];
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.drawShapes();
  }


  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const file = inputElement.files?.[0];

    if (!file) {
      this.filemessage = 'Nije odabran fajl.';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const shapesData = JSON.parse(reader.result as string);
        this.shapes = shapesData;
        this.drawShapes();
      } catch (error) {
        this.filemessage = 'Greška prilikom parsiranja JSON-a:';
      }
    };

    reader.readAsText(file);
  }

}

