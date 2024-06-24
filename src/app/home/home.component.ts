import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Subscription } from 'rxjs';
import { apiUrl } from '../url';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService, SelectItem } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MultiSelectModule } from 'primeng/multiselect';
import { WebsocketService } from '../websocket.service';
import { CategoryTypes, DecodedTokenTypes, NewProductTypes, ProductTypes } from './home.type';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    FormsModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    ToastModule,
    MultiSelectModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  schemas: [NO_ERRORS_SCHEMA]
})
export class HomeComponent {
  private subscription: Subscription;

  private websocketSubscription: Subscription = new Subscription();

  constructor(private http: HttpClient, private cookieService: CookieService, private messageService: MessageService, private websocketService: WebsocketService) {
    this.subscription = this.fetchDataProducts();
    this.subscription = this.fetchDataCategories();

    const token = this.cookieService.get('access_token');

    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedTokenTypes>(token);
        this.decodedToken = decodedToken;
        this.newProduct.user_id = decodedToken.id;
        this.user_id = decodedToken.id;
      } catch (error) {
        console.error('Invalid token:', error);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnInit() {
    this.websocketSubscription = this.websocketService.connect().subscribe({
      next: (message) => {
        console.log('Received message:', message);
      },
      error: (error) => {
        console.error('WebSocket error:', error);
      },
      complete: () => {
        console.log('WebSocket connection closed');
      }
    });
  }

  visibleModal: boolean = false;

  data: ProductTypes[] = [];

  decodedToken: DecodedTokenTypes | null = null;

  quantityToBuy: number = 1;

  visibleBuyModal: boolean = false;

  selectedProduct: ProductTypes | null = null;

  user_id = "";

  newProduct: NewProductTypes = {
    description: '',
    price: null,
    category_id: null,
    stock_quantity: null,
    user_id: 0
  };

  descriptionProduct = "";

  selectedCategories: number[] = [];

  categoryOptions: SelectItem[] = [];

  categoryOptionsMulti: SelectItem[] = [];

  fetchDataProducts(): Subscription {
    const selectedCategoryParams = this.selectedCategories.length > 0 ? `categories=${this.selectedCategories.join('&categories=')}` : '';
    const descriptionParam = this.descriptionProduct ? `description=${this.descriptionProduct}` : '';

    let queryParams = '';
    if (selectedCategoryParams && descriptionParam) {
      queryParams = `?${selectedCategoryParams}&${descriptionParam}`;
    } else if (selectedCategoryParams) {
      queryParams = `?${selectedCategoryParams}`;
    } else if (descriptionParam) {
      queryParams = `?${descriptionParam}`;
    }

    const url = apiUrl + "/product" + queryParams;

    return this.http.get<ProductTypes[]>(url).subscribe({
      next: (response) => {
        this.data = response;
      },
      error: (error) => {
        console.error('Erro ao buscar dados:', error);
      }
    });
  }

  fetchDataCategories(): Subscription {
    const urlCategories = apiUrl + "/category";

    return this.http.get<CategoryTypes[]>(urlCategories).subscribe({
      next: (response) => {
        this.categoryOptions = response.map(category => ({
          label: category.description,
          value: category.id
        }));

        this.categoryOptionsMulti = response.map(category => ({
          label: category.description,
          value: category.id
        }));
      },
      error: (error) => {
        console.error('Erro ao buscar categorias:', error);
      }
    });
  }

  saveNewProduct() {
    if (!this.isFormValid()) {
      this.showError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const url = apiUrl + "/product";
    this.http.post(url, this.newProduct).subscribe({
      next: () => {
        this.visibleModal = false;
        this.fetchDataProducts();

        this.newProduct = {
          description: '',
          price: null,
          category_id: null,
          stock_quantity: null,
          user_id: this.user_id
        };
      },
      error: (error) => {
        console.error('Erro ao salvar o novo item:', error);
      }
    });
  }

  isFormValid(): boolean {
    const { description, price, category_id, stock_quantity } = this.newProduct;

    if (description.trim() === '' || price === null || category_id === null || stock_quantity === null) {
      return false;
    }

    if (typeof price !== 'number' || typeof stock_quantity !== 'number') {
      return false;
    }

    return price > 0 && stock_quantity >= 0;
  }

  openBuyModal(item: ProductTypes): void {
    this.selectedProduct = item;
    this.visibleBuyModal = true;
    this.quantityToBuy = 1;
  }

  savePurchase(): void {
    const currentDate = new Date().toISOString();

    const purchaseData = {
      product_id: this.selectedProduct?.id,
      quantity: this.quantityToBuy,
      user_id: this.user_id,
      purchase_date: currentDate,
    };

    if (this.quantityToBuy <= 0) {
      return this.showError("Valor inválido!");
    }

    const url = apiUrl + '/purchase';
    this.http.post(url, purchaseData).subscribe({
      next: () => {
        this.visibleBuyModal = false;
        this.fetchDataProducts();
        this.showSuccess("Compra realizada com sucesso!");
        const wsMessage = {
          event: 'purchase_made',
          data: purchaseData
        };
        this.websocketService.sendMessage(wsMessage);
      },
      error: (error) => {
        const errorMessage = error.error?.detail || 'Erro ao realizar compra';
        this.showError(errorMessage);
      }
    });
  }

  openNewProductModal(): void {
    this.visibleModal = true;
  }

  showError(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }

  showSuccess(message: string) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
  }

  filterProductsByCategory() {
    this.fetchDataProducts();
  }
}
