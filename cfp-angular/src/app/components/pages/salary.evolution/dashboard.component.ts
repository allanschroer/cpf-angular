import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { EmployeeService } from '../../../services/employee/employee.api.service';

import {
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';

Chart.register(
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip
);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatGridListModule, MatIconModule, BaseChartDirective],
})
export class DashboardComponent implements OnInit {
  averageSalaryChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Average Salary',
        backgroundColor: 'rgba(25, 118, 210, 0.5)',
      },
    ],
  };

  averageSalaryChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Average Salary by Position',
      },
    },
  };

  averageTenureChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Average Tenure (Months)',
        backgroundColor: 'rgba(156, 39, 176, 0.5)',
      },
    ],
  };

  averageTenureChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Average Tenure by Position (Months)',
      },
    },
  };

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.employeeService.getEmployeesMetrics().subscribe((metrics) => {
      this.updateAverageSalaryChart(metrics.averageSalaries);
      this.updateAverageTenureChart(metrics.averageTenure);
    });
  }

  private updateAverageSalaryChart(data: any): void {
    this.averageSalaryChartData = {
      labels: data.positions,
      datasets: [
        {
          data: data.averages,
          label: 'Average Salary',
          backgroundColor: 'rgba(25, 118, 210, 0.5)',
        },
      ],
    };
  }

  private updateAverageTenureChart(data: any): void {
    this.averageTenureChartData = {
      labels: data.positions,
      datasets: [
        {
          data: data.averages,
          label: 'Average Tenure (Months)',
          backgroundColor: 'rgba(156, 39, 176, 0.5)',
        },
      ],
    };
  }
}
