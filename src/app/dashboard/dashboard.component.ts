import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { Subscription } from 'rxjs';
import { apiUrl } from '../url';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';
import { WebsocketService } from '../websocket.service';
import { PurchaseTypes, TopCategoryTypes, TopProductTypes } from './dashboard.type';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TableModule,
    ChartModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})

export class DashboardComponent {
  private subscription: Subscription;

  private websocketSubscription: Subscription = new Subscription();

  constructor(private http: HttpClient, private websocketService: WebsocketService) {
    this.subscription = this.fetchDataLastPurchases();
    this.subscription = this.fetchDataTopCategories();
  }

  chartData: any;

  chartOptions: any;

  barChartOptions: any;

  barChartData: any;

  lastPurchases: PurchaseTypes[] = [];

  topCategories: TopCategoryTypes[] = [];

  topProducts: TopProductTypes[] = [];

  ngOnInit() {
    this.fetchDataTopCategories();
    this.fetchDataTopProducts();

    this.chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'right',
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem: any) {
              return tooltipItem.label + ': ' + tooltipItem.raw;
            }
          }
        }
      }
    };

    this.barChartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem: any) {
              return tooltipItem.dataset.label + ': ' + tooltipItem.raw;
            }
          }
        }
      }
    };

    this.websocketSubscription = this.websocketService.connect().subscribe({
      next: (message) => {
        this.handleWebSocketMessage(message);
      },
      error: (error) => {
        console.error('WebSocket error:', error);
      },
      complete: () => { }
    });
  }

  handleWebSocketMessage(message: any) {
    if (message.event === 'purchase_made') {
      this.fetchDataLastPurchases();
      this.fetchDataTopCategories();
      this.fetchDataTopProducts();
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.websocketSubscription) {
      this.websocketSubscription.unsubscribe();
    }
  }

  fetchDataLastPurchases(): Subscription {
    const url = apiUrl + "/purchase/last";

    return this.http.get<PurchaseTypes[]>(url).subscribe({
      next: (response) => {
        this.lastPurchases = response;
      },
      error: (error) => {
        console.error('Erro ao buscar dados:', error);
      }
    });
  }

  fetchDataTopCategories(): Subscription {
    const url = apiUrl + "/category/top";

    return this.http.get<TopCategoryTypes[]>(url).subscribe({
      next: (response) => {
        this.topCategories = response;
        this.transformChartData();
      },
      error: (error) => {
        console.error('Erro ao buscar dados:', error);
      }
    });
  }

  fetchDataTopProducts(): Subscription {
    const url = apiUrl + "/purchase/top";

    return this.http.get<TopProductTypes[]>(url).subscribe({
      next: (response) => {
        this.topProducts = response;
        this.transformBarChartData();
      },
      error: (error) => {
        console.error('Erro ao buscar dados:', error);
      }
    });
  }

  transformChartData() {
    const labels = this.topCategories.map(item => item.category.description);
    const values = this.topCategories.map(item => item.sales_count);

    this.chartData = {
      labels: labels,
      datasets: [
        {
          data: values,
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
            "#E7E9ED",
            "#76FF03",
            "#FFEB3B",
            "#FF9800"
          ]
        }
      ]
    };
  }

  transformBarChartData() {
    const labels = this.topProducts.map(item => item.product.description);
    const values = this.topProducts.map(item => item.total_quantity);

    this.barChartData = {
      labels: labels,
      datasets: [
        {
          label: 'Total vendidos',
          data: values,
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
            "#E7E9ED",
            "#76FF03",
            "#FFEB3B",
            "#FF9800"
          ],
          borderColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
            "#E7E9ED",
            "#76FF03",
            "#FFEB3B",
            "#FF9800"
          ],
          borderWidth: 1
        }
      ]
    };
  }

}
