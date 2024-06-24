import { Component, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { WaiterService } from '../services/waiter.service';
import { User } from '../models/user';
import { NgChartsModule } from 'ng2-charts';
import { Restaurant } from '../models/restaurant';
import * as Chart from 'chart.js';

@Component({
  selector: 'app-waiter-statistics',
  templateUrl: './waiter-statistics.component.html',
  styleUrls: ['./waiter-statistics.component.css'],
  standalone:true,
  imports: [NgChartsModule]
})
export class WaiterStatisticsComponent implements OnInit {
  waiter: User = new User();
  restaurant:Restaurant = new Restaurant()

  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak', 'Subota', 'Nedelja'],
    datasets: [{ data: [0, 0, 0, 0, 0, 0, 0], label: 'Series A' }]
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
  };

  waiterList: { _id: string; korIme: string; }[] = [];

  constructor(private waiterService: WaiterService) {}

  ngOnInit(): void {
    this.waiter = JSON.parse(localStorage.getItem("user") || "");
    this.waiterService.getGuestCountByDay(this.waiter._id).subscribe(
      (data: any[]) => {
        const formattedData = this.formatDataBar(data);
        this.updateChartDataBar(formattedData);
      },
      (error) => {
        console.error('Greška prilikom dohvatanja podataka:', error);
      }
    );
    this.waiterService.getRestoranByWaiterId(this.waiter._id).subscribe(
      (rest)=>{
        this.waiterService.getAllWaiters().subscribe(
          (waiters: any[]) => {
            this.waiterList = waiters.map(waiter => ({ _id: waiter._id, korIme: waiter.korIme }));
            this.restaurant = rest
            this.waiterService.getGuestDistribution(this.restaurant._id).subscribe(
              (data: any[]) => {
                const formattedData = this.formatDataPie(data);
                this.updateChartDataPie(formattedData);
              },
              (error) => {
                console.error('Greška prilikom dohvatanja podataka:', error);
              }
            );
          },
          (error) => {
            console.error('Greška prilikom dohvatanja konobara:', error);
          }
        );

        this.waiterService.getAverageReservationsByWeekday(rest._id).subscribe(
          (data) => {
            console.log(data)
            const formattedData = this.formatDataForHistogram(data);
            console.log(formattedData)
            this.updateHistogramData(formattedData);
          },
          (error) => {
            console.error('Greška prilikom dohvatanja konobara:', error);
          }
        )
      }
    )
  }

  private formatDataBar(data: any[]): number[] {
    const formatted = [0, 0, 0, 0, 0, 0, 0];
    data.forEach(item => {
      formatted[item.dayOfWeek - 1] = item.count;
    });
    return formatted;
  }

  private updateChartDataBar(data: number[]): void {
    this.barChartData = Object.assign({}, this.barChartData, {
      datasets: [{ data: data, label: this.waiter.korIme}]
    });
  }


  public pieChartLegend = true;
  public pieChartPlugins = [];

  public pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: [],
    datasets: [{ data: [], backgroundColor: [] }]
  };

  public pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
  };


  findKorImeById(idToFind: string): string {
    const foundWaiter = this.waiterList.find(waiter => waiter._id === idToFind);
    return foundWaiter ? foundWaiter.korIme : "";
  }

  private formatDataPie(data: any[]): { labels: string[], data: number[], backgroundColor: string[] } {
    const filteredData = data.filter(item => item._id !== null && item._id !== "");
    const labels = filteredData.map(item => this.findKorImeById(item._id));
    const counts = filteredData.map(item => item.count);
    const backgroundColor = this.generateRandomColors(data.length);
    return { labels, data: counts, backgroundColor };
  }

  private generateRandomColors(count: number): string[] {
    const colors = [];
    for (let i = 0; i < count; i++) {
      colors.push(`#${Math.floor(Math.random()*16777215).toString(16)}`);
    }
    return colors;
  }

  private updateChartDataPie(data: { labels: string[], data: number[], backgroundColor: string[] }): void {
    this.pieChartData = Object.assign({}, this.pieChartData, {
      labels: data.labels,
      datasets: [{ data: data.data, backgroundColor: data.backgroundColor }]
    });
  }

  public histogramLegend = false;
  public histogramPlugins = [];

  public histogramData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak', 'Subota', 'Nedelja'],
    datasets: [{ data: [0, 0, 0, 0, 0, 0, 0], label: 'Series A' }]
  };

  public histogramOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
  };

  // 104.357142 je prosecan broj nedelja u 24 meseca
  private formatDataForHistogram(data: any[]): number[] {
    const formatted = [0, 0, 0, 0, 0, 0, 0];
    data.forEach(item => {
      formatted[item._id - 1] = item.avgReservations/104.357142;
    });
    return formatted;
  }

  private updateHistogramData(data: number[]): void {
    this.histogramData = Object.assign({}, this.histogramData, {
      datasets: [{ data: data}]
    });
  }


}
