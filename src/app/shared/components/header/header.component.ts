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
  private intervalId: any; 

  constructor(private router: Router, private supabaseService: SupabaseService) {}

  async ngOnInit() {
    try {
      const user = await this.supabaseService.getCurrentUser();

      if (user) {
        this.userName = user.name || 'Unnamed User';
        this.profileImageUrl = user.profile_image || 'assets/profile/default-profile.jpg';
        this.userRole = user.role || '';
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
    }

    this.updateCurrentTime(); // Initialize the time display
    this.intervalId = setInterval(() => this.updateCurrentTime(), 1000); // Update time every second
  }

  ngOnDestroy() {
    clearInterval(this.intervalId); // Clear interval when component is destroyed
  }

  updateCurrentTime() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString(); // Format time as needed
  }

  navigateToProfile() {
    if (this.userRole === 'admin') {
      this.router.navigate(['/admin/a-profile']);
    } else {
      this.router.navigate(['/user/u-profile']);
    }
  }
}
