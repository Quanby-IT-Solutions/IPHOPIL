import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { gsap } from 'gsap';
import { SupabaseService } from '../../../core/services/supabase.service';


Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  totalDocuments: number = 0;

  documentStats: { title: string; value: number; icon: string; iconColor: string }[] = [];
  alerts = [
    { type: 'warning', title: 'Urgent Review Needed', message: '3 documents require immediate attention.' },
    { type: 'info', title: 'System Update', message: 'Scheduled maintenance on Saturday, 10 PM - 2 AM.' }
  ];

  private chart: Chart<"doughnut", number[], string> | null = null;

  constructor(private router: Router, private supabaseService: SupabaseService) {}

  ngOnInit(): void {
    this.fetchDocumentStats();
  }

  async fetchDocumentStats(): Promise<void> {
    try {
      const incomingCount = await this.supabaseService.countDocuments('incoming_documents');
      const receivedCount = await this.supabaseService.countDocuments('received_documents');
      const outgoingCount = await this.supabaseService.countDocuments('outgoing_documents');
      const completedCount = await this.supabaseService.countDocuments('outgoing_documents');

      this.totalDocuments = incomingCount + receivedCount + outgoingCount + completedCount;

      this.documentStats = [
        //{ title: 'Total Documents', value: incomingCount + receivedCount + outgoingCount, icon: 'fas fa-file-alt', iconColor: 'text-emerald-500' }, // file icon
        { title: 'TOTAL INCOMING', value: incomingCount, icon: 'fas fa-inbox', iconColor: 'text-orange-500' }, // inbox icon
        { title: 'TOTAL RECEIVED', value: receivedCount, icon: 'fas fa-folder-open', iconColor: 'text-yellow-500' }, // folder-open icon
        { title: 'TOTAL OUTGOING', value: outgoingCount, icon: 'fas fa-paper-plane', iconColor: 'text-blue-500' }, // paper-plane icon
        { title: 'TOTAL COMPLETED', value: completedCount, icon: 'fas fa-check-circle', iconColor: 'text-red-500' } // check-circle icon
      ];
      
      

      // Initialize chart with fetched document stats
      this.initChart(incomingCount, receivedCount, outgoingCount, completedCount);

    } catch (error) {
      console.error('Error fetching document stats:', error);
    }
  }

  ngAfterViewInit(): void {
    this.animateStats();
  }

  private initChart(incoming: number, received: number, outgoing: number, completed:number): void {
    const ctx = this.chartCanvas.nativeElement.getContext('2d')!;
    const logoImage = new Image();
    logoImage.src = 'assets/logo/cube.png';

    const centerImagePlugin = {
      id: 'centerImage',
      beforeDraw: function(chart: Chart<"doughnut">) {
        const ctx = chart.ctx;
        const { top, bottom, left, right } = chart.chartArea;
        const xCenter = (left + right) / 2;
        const yCenter = (top + bottom) / 2;
    
        // Ensure the image is fully loaded before drawing
        if (logoImage.complete) {
          const imgSize = 100; // Set image size
          ctx.drawImage(logoImage, xCenter - imgSize / 2, yCenter - imgSize / 2, imgSize, imgSize);
        }}}

    
    
    // Destroy the existing chart if it exists to prevent memory leaks
    if (this.chart) {
      this.chart.destroy();
    }

    // Create new donut chart
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
        cutout:'50%',
        plugins: {
          legend: { display: false }, // Show legend for donut chart
          title: { display: false, text: 'Document Status Overview' }
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
