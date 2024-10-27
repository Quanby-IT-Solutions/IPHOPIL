import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { gsap } from 'gsap';
import { SupabaseService } from '../../../core/services/supabase.service';


Chart.register(...registerables);

@Component({
  selector: 'app-u-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './u-dashboard.component.html',
  styleUrls: ['./u-dashboard.component.css']
})
export class UDashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  documentStats: { title: string; value: number; icon: string; iconColor: string }[] = [];
  alerts = [
    { type: 'warning', title: 'Urgent Review Needed', message: '3 documents require immediate attention.' },
    { type: 'info', title: 'System Update', message: 'Scheduled maintenance on Saturday, 10 PM - 2 AM.' }
  ];

  private chart: Chart | undefined;

  constructor(private router: Router, private supabaseService: SupabaseService) {}

  ngOnInit(): void {
    this.fetchDocumentStats();
  }

  async fetchDocumentStats(): Promise<void> {
    try {
      const incomingCount = await this.supabaseService.countDocuments('incoming_documents');
      const receivedCount = await this.supabaseService.countDocuments('received_documents');
      const outgoingCount = await this.supabaseService.countDocuments('outgoing_documents');

      this.documentStats = [
        //{ title: 'Total Documents', value: incomingCount + receivedCount + outgoingCount, icon: 'fas fa-file-alt', iconColor: 'text-emerald-500' }, // file icon
        { title: 'TOTAL INCOMING', value: incomingCount, icon: 'fas fa-inbox', iconColor: 'text-orange-500' }, // inbox icon
        { title: 'TOTAL RECEIVED', value: receivedCount, icon: 'fas fa-folder-open', iconColor: 'text-yellow-500' }, // folder-open icon
        { title: 'TOTAL OUTGOING', value: outgoingCount, icon: 'fas fa-paper-plane', iconColor: 'text-blue-500' }, // paper-plane icon
        { title: 'TOTAL COMPLETED', value: outgoingCount, icon: 'fas fa-check-circle', iconColor: 'text-red-500' } // check-circle icon
      ];
      
      

      // Initialize chart with fetched document stats
      this.initChart(incomingCount, receivedCount, outgoingCount);
    } catch (error) {
      console.error('Error fetching document stats:', error);
    }
  }

  ngAfterViewInit(): void {
    this.animateStats();
  }

  private initChart(incoming: number, received: number, outgoing: number): void {
    const ctx = this.chartCanvas.nativeElement.getContext('2d')!;

    // Destroy the existing chart if it exists to prevent memory leaks
    if (this.chart) {
      this.chart.destroy();
    }

    // Create new chart
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Incoming', 'Received', 'Outgoing'],
        datasets: [{
          data: [incoming, received, outgoing],
          backgroundColor: ['#FCD34D', '#34D399', '#F87171'],
          borderColor: ['#FBBF24', '#10B981', '#EF4444'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Document Status Overview' }
        },
        scales: {
          x: {
            beginAtZero: true,
            title: { display: true, text: 'Status' }
          },
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Count' }
          }
        }
      }
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
