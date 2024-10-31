import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { gsap } from 'gsap';
import { CommonModule } from '@angular/common';

Chart.register(...registerables);

@Component({
  selector: 'app-u-dashboard',
  templateUrl: './u-dashboard.component.html',
  styleUrls: ['./u-dashboard.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class UDashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  totalDocuments: number = 0;
  documentStats: { title: string; value: number; icon: string; iconColor: string }[] = [];
  alerts = [
    { type: 'warning', title: 'Urgent Review Needed', message: '3 documents require immediate attention.' },
    { type: 'info', title: 'System Update', message: 'Scheduled maintenance on Saturday, 10 PM - 2 AM.' }
  ];
  myDocuments = [
    { title: "Jeremiah's Payroll", classification: "Classification", type: "Type", currentOffice: "Daraga Albay" },
    { title: "Angat Buhay", classification: "Classification", type: "Type", currentOffice: "Daraga Albay" },
    { title: "Anton's ORCR", classification: "Classification", type: "Type", currentOffice: "Daraga Albay" }
  ];
  private chart: Chart<"doughnut", number[], string> | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.fetchDocumentStats();
  }

  fetchDocumentStats(): void {
    const incomingCount = 15;
    const receivedCount = 10;
    const outgoingCount = 8;
    const completedCount = 20;

    this.totalDocuments = incomingCount + receivedCount + outgoingCount + completedCount;
    this.documentStats = [
      { title: 'TOTAL INCOMING', value: incomingCount, icon: 'fas fa-inbox', iconColor: 'text-orange-500' },
      { title: 'TOTAL RECEIVED', value: receivedCount, icon: 'fas fa-folder-open', iconColor: 'text-yellow-500' },
      { title: 'TOTAL OUTGOING', value: outgoingCount, icon: 'fas fa-paper-plane', iconColor: 'text-blue-500' },
      { title: 'TOTAL COMPLETED', value: completedCount, icon: 'fas fa-check-circle', iconColor: 'text-red-500' }
    ];
  }

  ngAfterViewInit(): void {
    this.initChart(15, 10, 8, 20);
    this.animateStats();
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
        labels: ['Incoming', 'Received', 'Outgoing', 'Completed'],
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