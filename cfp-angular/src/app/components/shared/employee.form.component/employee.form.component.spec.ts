import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { EmployeeFormComponent } from './employee.form.component';
import { EmployeeService } from '../../../services/employee/employee.api.service';
import { FeedbackService } from '../../../services/feedback/feedback.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Employee, EmployeePosition } from '../../../models/employee';

describe('EmployeeFormComponent', () => {

  let fixture: ComponentFixture<EmployeeFormComponent>;
  let component: EmployeeFormComponent;


  let employeeServiceSpy: any;
  let feedbackServiceSpy: any;
  let dialogRefSpy: any;

  
  const samplePositions: EmployeePosition[] = [
    { id: 1, position: 'Junior Developer' },
    { id: 2, position: 'Senior Developer' },
    { id: 3, position: 'Project Manager' },
  ];

  const sampleEmployee: Employee = {
    id: 7134,
    name: 'Gustavo Gaitero',
    email: 'gugugaitero@gaita.com',
    position: 'Senior Developer',
    isActive: true,
    departureDate: '',
    salary: 54000,
    salaryHistory: [
      { date: 'Fri Jan 01 2021', amount: 51000 },
      { date: 'Sat Jan 01 2022', amount: 52000 },
      { date: 'Sun Jan 01 2023', amount: 53000 },
      { date: 'Mon Jan 01 2024', amount: 54000 },
    ],
  };

  function setupTestBedWithProviders(dataProviderValue: any) {
    employeeServiceSpy = {
      getEmployeePositions: jasmine.createSpy('getEmployeePositions').and.returnValue(of(samplePositions)),
      createEmployee: jasmine.createSpy('createEmployee').and.returnValue(of(sampleEmployee)),
      updateEmployee: jasmine.createSpy('updateEmployee').and.returnValue(of(sampleEmployee)),
    };

    feedbackServiceSpy = {
      showSuccess: jasmine.createSpy('showSuccess'),
      showError: jasmine.createSpy('showError'),
    };

    dialogRefSpy = {
      close: jasmine.createSpy('close'),
    };

    TestBed.configureTestingModule({
      imports: [EmployeeFormComponent, BrowserAnimationsModule],
      providers: [
        { provide: EmployeeService, useValue: employeeServiceSpy },
        { provide: FeedbackService, useValue: feedbackServiceSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: dataProviderValue },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeFormComponent);
    component = fixture.componentInstance;
  }

  describe('create mode', () => {
    beforeEach(() => {
      setupTestBedWithProviders({ employee: null });
      fixture.detectChanges();
    });

    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should load positions on init', () => {
      expect(employeeServiceSpy.getEmployeePositions).toHaveBeenCalled();
      expect(component.positions).toEqual(samplePositions);
    });

    it('should not call createEmployee if form is invalid', () => {
      component.onSubmit();
      expect(employeeServiceSpy.createEmployee).not.toHaveBeenCalled();
      expect(dialogRefSpy.close).not.toHaveBeenCalled();
    });

    it('should call createEmployee when form valid and close dialog on success', () => {
      component.employeeForm.patchValue({
        name: 'Allanzitos Embalagens',
        email: 'allanzitositos@gmail.com',
        position: 1,
        isActive: true,
        departureDate: '',
      });

      component.onSubmit();

      expect(employeeServiceSpy.createEmployee).toHaveBeenCalled();
      expect(feedbackServiceSpy.showSuccess).toHaveBeenCalledWith('Employee created successfully!');
      expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
    });

    it('should require departureDate when isActive is set to false', () => {
      component.employeeForm.patchValue({
        isActive: true,
      });

      component.employeeForm.get('isActive')?.setValue(false);

      const departureControl = component.employeeForm.get('departureDate');
      expect(departureControl?.validator).toBeDefined();
      expect(departureControl?.hasError('required')).toBeTrue();

      component.employeeForm.get('isActive')?.setValue(true);
      expect(departureControl?.hasError('required')).toBeFalse();
    });
  });

  describe('edit mode', () => {
    beforeEach(() => {
      // Provide an existing employee -> edit mode
      setupTestBedWithProviders({ employee: sampleEmployee });
      fixture.detectChanges();
    });

    it('should set isEdit to true and patch form with employee', () => {
      expect(component.isEdit).toBeTrue();
      expect(component.employeeForm.get('name')?.value).toBe(sampleEmployee.name);
      expect(component.employeeForm.get('email')?.value).toBe(sampleEmployee.email);
    });

    it('should map position name to position id and patch position control', () => {
      expect(component.positions).toEqual(samplePositions);
      expect(component.employeeForm.get('position')?.value).toBe(2);
    });

    it('should call updateEmployee on submit when editing', () => {
      // Ensure valid form
      component.employeeForm.patchValue({
        name: 'Updated Name',
        email: 'updated@example.com',
        position: 2,
        isActive: true,
      });

      component.onSubmit();

      expect(employeeServiceSpy.updateEmployee).toHaveBeenCalled();
      expect(feedbackServiceSpy.showSuccess).toHaveBeenCalledWith('Employee updated successfully!');
      expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
    });
  });
});