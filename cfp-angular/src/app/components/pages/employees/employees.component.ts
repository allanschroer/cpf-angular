import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Employee } from '../../../models/employee';
import { EmployeeService } from '../../../services/employee/employee.api.service';
import { EmployeeFormComponent } from '../../shared/employee.form.component/employee.form.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { filter } from 'rxjs/internal/operators/filter';
import { SalaryEvolutionComponent } from '../../shared/salary.evolution.component/salary.evolution.component';
import { MatIconModule } from "@angular/material/icon";
import { FeedbackService } from '../../../services/feedback/feedback.service';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule],
})
export class EmployeesComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'name',
    'email',
    'position',
    'isActive',
    'departureDate',
    'actions',
  ];

  employees$!: Observable<Employee[]>;
  
  constructor(
    private employeeService: EmployeeService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private feedbackService: FeedbackService
  ) {}

  ngOnInit(): void {
    this.loadEmployees();

    this.route.params
      .pipe(
        filter((params) => params['id']),
        switchMap((params) => this.employeeService.getEmployee(params['id']))
      )
      .subscribe((employee) => {
        this.showSalaryEvolution(employee);
      });
  }

  showSalaryEvolution(employee: Employee): void {
    this.dialog.open(SalaryEvolutionComponent, {
      width: '700px',
      data: { employee },
    });
  }

 loadEmployees(): void {
   this.employees$ = this.employeeService.getEmployees();
  }

  addEmployee(): void {
    const dialogRef = this.dialog.open(EmployeeFormComponent, {
      data: { employee: null },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.feedbackService.showSuccess('Employee added successfully!');
        this.loadEmployees();
      }
    });
  }

  editEmployee(employee: Employee): void {
    const dialogRef = this.dialog.open(EmployeeFormComponent, {
      data: { employee },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.feedbackService.showSuccess('Employee updated successfully!');
        this.loadEmployees();
      }
    });
  }

  deleteEmployee(id: number): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: () => {
          this.feedbackService.showSuccess('Employee deleted successfully!');
          this.loadEmployees();
        },
        error: (error) => {
          this.feedbackService.showError('Failed to delete employee. Please try again.');
          console.error('Delete error:', error);
        }
      });
    }
  }

  viewSalaryEvolution(employee: Employee): void {
    this.showSalaryEvolution(employee);
  }
}
