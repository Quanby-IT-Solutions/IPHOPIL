import { Component, AfterViewInit, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Chart, ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-a-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './a-dashboard.component.html'
})
export class ADashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  chart?: Chart;

  documentStats = [
    { 
      title: 'Pending Review', 
      value: 23, 
      icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />`, 
      iconColor: 'text-yellow-500' 
    },
    { 
      title: 'Approved', 
      value: 45, 
      icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />`, 
      iconColor: 'text-green-500' 
    },
    { 
      title: 'Rejected', 
      value: 7, 
      icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />`, 
      iconColor: 'text-red-500' 
    },
    { 
      title: 'Total Documents', 
      value: 75, 
      icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />`, 
      iconColor: 'text-blue-500' 
    }
  ];

  alerts = [
    { 
      type: 'warning', 
      title: 'Pending Approvals', 
      message: '5 documents require immediate attention.' 
    },
    { 
      type: 'info', 
      title: 'System Update', 
      message: 'Scheduled maintenance on Saturday, 10 PM - 2 AM.' 
    }
  ];

  quickActions = [
    { type: 'receive', label: 'Received', bgClass: 'bg-orange-500 hover:bg-orange-600'},
    { type: 'transmit', label: 'Released', bgClass: 'bg-green-500 hover:bg-green-600' },
    { type: 'add', label: 'Add New', bgClass: 'bg-purple-500 hover:bg-purple-600'}
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initChart();
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private initChart(): void {
    if (!this.chartCanvas) return;

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const data: ChartData = {
      labels: ['Incoming', 'Received', 'Outgoing'],
      datasets: [{
        data: [4, 5, 1],
        backgroundColor: [
          'rgba(252, 211, 77, 0.8)',  // Yellow
          'rgba(52, 211, 153, 0.8)',   // Green
          'rgba(248, 113, 113, 0.8)'   // Red
        ],
        borderColor: [
          '#FBBF24',
          '#10B981',
          '#EF4444'
        ],
        borderWidth: 2,
        hoverOffset: 4
      }]
    };

    const options: ChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            usePointStyle: true,
            font: {
              size: 12,
              family: "'Inter', sans-serif"
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(17, 24, 39, 0.8)',
          padding: 12,
          bodyFont: {
            size: 13,
            family: "'Inter', sans-serif"
          },
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.raw;
              const total = context.dataset.data.reduce((a: any, b: any) => a + b, 0);
              const percentage = Math.round((value as number / total) * 100);
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        }
      }
    };

    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: data,
      options: options
    } as any); // Using type assertion as a temporary fix
  }

  quickAction(action: string): void {
    switch (action) {
      case 'receive':
        this.router.navigate(['/admin/a-received']);
        break;
      case 'transmit':
        this.router.navigate(['/admin/a-outgoing']);
        break;
      case 'add':
        this.router.navigate(['/admin/a-documents']);
        break;
      default:
        console.log(`Unhandled quick action: ${action}`);
    }
  }
}