import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Subscription } from 'rxjs';
import { apiUrl } from '../url';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CategoryTypes } from './category.type';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    TableModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    ToastModule,
  ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent {
  private subscription: Subscription;

  constructor(private http: HttpClient, private messageService: MessageService) {
    this.subscription = this.fetchData();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  visible: boolean = false;

  categories: CategoryTypes[] = [];

  newCategory: { description: string } = { description: '' };

  fetchData(): Subscription {
    const url = apiUrl + "/category";

    return this.http.get<CategoryTypes[]>(url).subscribe({
      next: (response) => {
        this.categories = response;
      },
      error: (error) => {
        console.error('Erro ao buscar dados:', error);
      }
    });
  }

  saveCategory() {
    const url = apiUrl + "/category";
    if (!this.isFormValid()) {
      this.showError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    this.http.post(url, this.newCategory).subscribe({
      next: () => {
        this.visible = false;
        this.fetchData();
        this.newCategory.description = '';
      },
      error: (error) => {
        console.error('Erro ao salvar a categoria:', error);
      }
    });
  }

  isFormValid(): boolean {
    const { description } = this.newCategory;
    if (description.trim() === '') {
      return false;
    } else {
      return true;
    }
  }

  showDialog() {
    this.visible = true;
  }

  showError(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }
}
