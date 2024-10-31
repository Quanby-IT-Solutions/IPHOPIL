import { Component, AfterViewInit, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Chart } from 'chart.js';
import gsap from 'gsap';

@Component({
  selector: 'app-a-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './a-dashboard.component.html'
})
export class ADashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  totalDocuments: number = 0;

  documentStats: { title: string; value: number; icon: string; iconColor: string }[] = [];
  alerts = [
    { type: 'warning', title: 'Urgent Review Needed', message: '3 documents require immediate attention.' },
    { type: 'info', title: 'System Update', message: 'Scheduled maintenance on Saturday, 10 PM - 2 AM.' }
  ];

  myDocuments = [
    {
      title: "Angat Buhay",
      classification: "Classification",
      type: "Type",
      currentOffice: "Daraga Albay"
    },
    {
      title: "Jeremiah's Payroll",
      classification: "Classification",
      type: "Type",
      currentOffice: "Daraga Albay"
    },
    {
      title: "Anton's ORCR",
      classification: "Classification",
      type: "Type",
      currentOffice: "Daraga Albay"
    }
  ];

  private chart: Chart<"doughnut", number[], string> | null = null;

  constructor(private router: Router) {}

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.fetchDocumentStats();
  }

  ngAfterViewInit(): void {
    if (this.chartCanvas) {
      this.initChart(15, 10, 8, 20); // Sample data, replace with actual fetched data
      this.animateStats();
    } else {
      console.error('Chart canvas is not initialized.');
    }
  }

  fetchDocumentStats(): void {
    const incomingCount = 15;
    const receivedCount = 10;
    const outgoingCount = 8;
    const completedCount = 20;

    this.totalDocuments = incomingCount + receivedCount + outgoingCount + completedCount;
    this.documentStats = [
      { title: 'PENDING REVIEW', value: incomingCount, icon: 'fas fa-clock', iconColor: 'text-orange-500' },
      { title: 'TOTAL REJECTED', value: receivedCount, icon: 'fas fa-times-circle', iconColor: 'text-yellow-500' },
      { title: 'TOTAL APPROVALS', value: outgoingCount, icon: 'fas fa-check', iconColor: 'text-blue-500' },
      { title: 'TOTAL COMPLETED', value: completedCount, icon: 'fas fa-check-circle', iconColor: 'text-red-500' }
    ];
  }

  private initChart(incoming: number, received: number, outgoing: number, completed: number): void {
    if (!this.chartCanvas || !this.chartCanvas.nativeElement) {
      console.error('Chart canvas is not initialized.');
      return;
    }

    const ctx = this.chartCanvas.nativeElement.getContext('2d')!;
    const logoImage = new Image();
    logoImage.src = 'assets/logo/cube.png';

    const centerImagePlugin = {
      id: 'centerImage',
      beforeDraw: function (chart: Chart<"doughnut">) {
        const ctx = chart.ctx;
        const { top, bottom, left, right } = chart.chartArea;
        const xCenter = (left + right) / 2;
        const yCenter = (top + bottom) / 2;

        if (logoImage.complete) {
          const imgSize = 100;
          ctx.drawImage(logoImage, xCenter - imgSize / 2, yCenter - imgSize / 2, imgSize, imgSize);
        }
      }
    };

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Review', 'Reject', 'Approved', 'Completed'],
        datasets: [{
          data: [incoming, received, outgoing, completed],
          backgroundColor: ['#FCD34D', '#34D399', '#F87171', '#EF8844'],
          borderColor: ['#FBBF24', '#10B981', '#EF4444', '#FA7E2D'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        cutout: '50%',
        plugins: {
          legend: { display: false },
          title: { display: false }
        }
      },
      plugins: [centerImagePlugin]
    });
  }

  private animateStats(): void {
    gsap.from('.stat-card', {
      opacity: 0,
      y: 20,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power2.out'
    });
  }

  quickAction(action: string): void {
    switch (action) {
      case 'receive':
        this.router.navigate(['/user/received']);
        break;
      case 'transmit':
        this.router.navigate(['/user/outgoing']);
        break;
      case 'add':
        this.router.navigate(['/user/documents']);
        break;
      default:
        console.log(`Unhandled quick action: ${action}`);
    }
  }
}
