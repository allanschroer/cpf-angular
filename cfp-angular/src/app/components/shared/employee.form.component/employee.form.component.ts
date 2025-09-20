import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Employee } from '../../../models/employee';
import { EmployeeService } from '../../../services/employee/employee.api.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatNativeDateModule, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, NativeDateAdapter } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { FeedbackService } from '../../../services/feedback/feedback.service';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee.form.component.html',
  styleUrls: ['./employee.form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatButtonModule,
    MatDialogModule,
    MatNativeDateModule,
    MatTableModule,
    ReactiveFormsModule,
  ],
  providers: [
  MatDatepickerModule,
  { provide: DateAdapter, useClass: NativeDateAdapter },
  { provide: MAT_DATE_LOCALE, useValue: 'en' },
  { provide: MAT_DATE_FORMATS, useValue: {
      parse: {
        dateInput: 'DD/MM/YYYY',
      },
      display: {
        dateInput: 'DD/MM/YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
      },
    }
  }
]
})
export class EmployeeFormComponent {
  employeeForm: FormGroup;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private feedbackService: FeedbackService,
    private dialogRef: MatDialogRef<EmployeeFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { employee: Employee | null }
  ) {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      position: ['', Validators.required],
      isActive: [true, Validators.required],
      standalone: true,
      departureDate: [''],
    });

    if (data.employee) {
      this.isEdit = true;
      this.employeeForm.patchValue(data.employee);
    }

    this.employeeForm.get('isActive')?.valueChanges.subscribe((isActive) => {
      const departureDateControl = this.employeeForm.get('departureDate');
      if (!isActive) {
        departureDateControl?.setValidators(Validators.required);
      } else {
        departureDateControl?.clearValidators();
      }
      departureDateControl?.updateValueAndValidity();
    });
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      const employee: Employee = {
        ...this.employeeForm.value,
        id: this.data.employee?.id || 0,
      };
      if (this.isEdit) {
        this.employeeService.updateEmployee(employee.id, employee).subscribe({
          next: () => {
            this.feedbackService.showSuccess('Employee updated successfully!');
            this.dialogRef.close(true);
          },
          error: (error) => {
            this.feedbackService.showError('Failed to update employee. Please try again.');
            console.error('Update error:', error, employee);
          }
        });
      } else {
        this.employeeService.createEmployee(employee).subscribe({
          next: () => {
            this.feedbackService.showSuccess('Employee created successfully!');
            this.dialogRef.close(true);
          },
          error: (error) => {
            this.feedbackService.showError('Failed to create employee. Please try again.');
            console.error('Create error:', error);
          }
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
