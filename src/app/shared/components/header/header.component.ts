import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../../../core/services/supabase.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true
})
export class HeaderComponent implements OnInit, OnDestroy {
  userName: string | null = '';
  profileImageUrl = 'assets/profile/default-profile.jpg';
  userRole: string | null = '';
  currentTime = ''; 
  private intervalId: ReturnType<typeof setInterval> | null = null;

  constructor(private router: Router, private supabaseService: SupabaseService) {}

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