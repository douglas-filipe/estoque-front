import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { HomeComponent } from './home/home.component';
import { CategoryComponent } from './category/category.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SignupComponent } from './signup/signup.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: '', canActivate: [AuthGuard], component: HomeComponent },
    { path: 'category', canActivate: [AuthGuard], component: CategoryComponent },
    { path: 'dashboard', canActivate: [AuthGuard], component: DashboardComponent },
];
