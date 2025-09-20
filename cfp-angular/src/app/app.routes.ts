import { Routes } from '@angular/router';
import { EmployeesComponent } from './components/pages/employees.component/employees.component';
import { DashboardComponent } from './components/pages/dashboard.component/dashboard.component';
import { LayoutComponent } from './components/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { 
        path: 'employees', 
        children: [
          { path: '', component: EmployeesComponent },
          { path: ':id', component: EmployeesComponent }
        ]
      }
    ]
  }
];
