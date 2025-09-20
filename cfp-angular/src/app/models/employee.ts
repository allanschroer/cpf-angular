export interface Employee {
  id: number;
  name: string;
  email: string;
  position: string;
  isActive: boolean;
  departureDate?: string;
  salary: number;
  salaryHistory?: SalaryHistory[];
}

export interface SalaryHistory {
  amount: number;
  date: string;
}

export interface EmployeeMetrics {
  averageSalaries: {
    positions: string[];
    averages: number[];
  };
  averageTenure: {
    positions: string[];
    averages: number[];
  };
  salaryEvolution: {
    dates: string[];
    employees: {
      name: string;
      salaries: number[];
    }[];
  };
}

export interface EmployeePosition {
  id : number;
  position: string;
}
