import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { Employee, EmployeeMetrics, EmployeePosition, SalaryHistory } from '../../models/employee';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private baseUrl = 'http://localhost:3000';
  private employeesUrl = `${this.baseUrl}/employees`;
  private metricsUrl = `${this.baseUrl}/metrics`;
  private positionsUrl = `${this.baseUrl}/positions`;

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    console.error('API Error:', error);
    if (error.status === 404) {
      errorMessage = 'Employee not found. Please check if the ID exists.';
    } else if (!error.status) {
      errorMessage = 'Server is not responding. Please check if JSON server is running.';
    } else {
      errorMessage = `Server error: ${error.status} - ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.employeesUrl).pipe(catchError(this.handleError));
  }

  getEmployee(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.employeesUrl}/${id}`).pipe(catchError(this.handleError));
  }

  createEmployee(employee: Employee): Observable<Employee> {
    var id = this.getRandomInt(1, 9999);

    this.http.get<Employee>(`${this.employeesUrl}/${id}`).pipe(
      tap((data) => {
        if (data != null) {
          this.createEmployee(employee);
        }
      })
    );

    employee.id = id;
    return this.http.post<Employee>(this.employeesUrl, employee).pipe(catchError(this.handleError));
  }

  updateEmployee(id: number, employee: Employee): Observable<Employee> {
    const updatedEmployee = {
      ...employee,
      id,
    };
    return this.http
      .put<Employee>(`${this.employeesUrl}/${id}`, updatedEmployee)
      .pipe(catchError(this.handleError));
  }

  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.employeesUrl}/${id}`).pipe(catchError(this.handleError));
  }

  getEmployeesMetrics(): Observable<EmployeeMetrics> {
    return this.http.get<EmployeeMetrics>(this.metricsUrl).pipe(catchError(this.handleError));
  }

  getEmployeeSalaryHistory(id: number): Observable<SalaryHistory[]> {
    return this.http.get<Employee>(`${this.employeesUrl}/${id}`).pipe(
      map((employee) => employee.salaryHistory || []),
      catchError(this.handleError)
    );
  }

  getEmployeePositions(): Observable<EmployeePosition[]> {
    return this.http.get<EmployeePosition[]>(this.positionsUrl).pipe(catchError(this.handleError));
  }

  private getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
