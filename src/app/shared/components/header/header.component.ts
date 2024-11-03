import { Component, OnInit, OnDestroy, HostListener, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../../../core/services/supabase.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class HeaderComponent implements OnInit, OnDestroy {
  userName: string | null = '';
  profileImageUrl = 'assets/profile/default-profile.jpg';
  userRole: string | null = '';
  currentTime = ''; 
  private intervalId: ReturnType<typeof setInterval> | null = null;

  isDropdownOpen = false;
  showNotif = false;
  isReportModalOpen = false;

  reportForm: FormGroup;

  constructor(private router: Router, private supabaseService: SupabaseService, private elementRef: ElementRef, private fb: FormBuilder) {
    this.reportForm = this.fb.group({
      feature: [''],
      type: [''],
      comment: ['']
    });
  }

  toggleDropdown(): void{
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event): void {
    if (this.isDropdownOpen && !this.elementRef.nativeElement.contains(event.target)) {
      this.isDropdownOpen = false;
      this.showNotif = false;
    }
  }

  goToProfile(): void {
    this.navigateToProfile();
  }

  viewNotif(): void {
    this.isDropdownOpen = false;
    this.showNotif = true;
  }

  goToMainMenu() {
    this.showNotif = false;
    this.toggleDropdown();
  }

  goToSettings(): void {
    
  }

  reportProblem(): void {
    this.isReportModalOpen = true;
  }

  closeReportModal(): void {
    this.isReportModalOpen = false;
  }
  
  submitReport(): void {
    console.log('Report Submitted:', this.reportForm.value);
    this.closeReportModal();
  }

  async ngOnInit() {
    try {
      const user = await this.supabaseService.getCurrentUser();

      if (user) {
        this.userName = user.name || 'Unnamed User';
        this.profileImageUrl = user.profile_image || 'assets/profile/default-profile.jpg';
        this.userRole = user.role || '';
      }
    } catch (error) {
      console.error('Error fetching user data:', error instanceof Error ? error.message : error);
    }

    this.updateCurrentTime();
    this.intervalId = setInterval(() => this.updateCurrentTime(), 1000);
  }

  ngOnDestroy() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  updateCurrentTime(): void {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString('en-US', {
      hour12: true,
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  navigateToProfile(): void {
    if (this.userRole === 'admin') {
      this.router.navigate(['/admin/profile']);
    } else {
      this.router.navigate(['/user/profile']);
    }
  }
}