import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BaseChartDirective, NgChartsConfiguration } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { Employee, SalaryHistory } from '../../../models/employee';

@Component({
  selector: 'app-salary.evolution.component',
  templateUrl: './salary.evolution.component.html',
  styleUrl: './salary.evolution.component.scss',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, BaseChartDirective],
})
export class SalaryEvolutionComponent {
  salaryChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Salary Evolution',
        fill: true,
        tension: 0.1,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  salaryChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Salary Evolution Over Time',
      },
      legend: {
        display: true,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Salary ($)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
    },
  };

  constructor(
    public dialogRef: MatDialogRef<SalaryEvolutionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { employee: Employee }
  ) {}

  ngOnInit() {
    if (this.data.employee.salaryHistory) {
      this.updateChartData(this.data.employee.salaryHistory);
    }
  }

  private updateChartData(salaryHistory: SalaryHistory[]) {
    const sortedHistory = [...salaryHistory].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    this.salaryChartData = {
      labels: sortedHistory.map((item) =>
        new Date(item.date)
          .toLocaleDateString('en', {
            year: 'numeric',
            month: '2-digit',
          })
          .replace('/', '-')
      ),
      datasets: [
        {
          data: sortedHistory.map((item) => item.amount),
          label: `${this.data.employee.name}'s Salary Evolution`,
          fill: false,
          tension: 0.1,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
        },
      ],
    };
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
