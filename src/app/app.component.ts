import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MenubarModule,
    CardModule,
    ButtonModule,
    MenuModule,
    CommonModule,
    ToastModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [MessageService]
})
export class AppComponent {
  constructor(private router: Router, private cookieService: CookieService) { }

  title = 'estoque-front';

  items: MenuItem[] | undefined;

  showMenu: boolean = true;

  logout(): void {
    this.cookieService.delete('access_token');
    this.router.navigate(['/login']);
  }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showMenu = !(event.url === '/login' || event.url === '/signup');
      }
    });


    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        routerLink: '/'
      },
      {
        label: 'Dashboard',
        icon: 'pi pi-chart-bar',
        routerLink: 'dashboard'
      },
      {
        label: 'Categorias',
        icon: 'pi pi-bars',
        routerLink: "/category"
      },
      {
        label: 'Sair',
        icon: 'pi pi-sign-out',
        command: () => this.logout()
      },
    ]
  }
}
