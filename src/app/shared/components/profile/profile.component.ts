import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { SupabaseService } from '../../../core/services/supabase.service'; 
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: true,
  imports: [HeaderComponent, CommonModule, ReactiveFormsModule]
})
export class ProfileComponent implements OnInit {
  user: {
    userName: string | null;
    profile_image: string;
    userEmail: string | null;
  } = {
    userName: null,
    profile_image: 'assets/profile/default-profile.jpg',
    userEmail: null,
  };

  isPassModalOpen = false;
  isProfileModalOpen = false;

  constructor(private supabaseService: SupabaseService, private location: Location) {}

  goBack(): void{
    this.location.back();
  }

  openPassModal(): void {
    this.isPassModalOpen = true;
  }

  closePassModal(): void {
    this.isPassModalOpen = false;
  }

  openProfileModal(): void {
    this.isProfileModalOpen = true;
  }

  closeProfileModal(): void {
    this.isProfileModalOpen = false; 
  }

  async ngOnInit(): Promise<void> {
    try {
      const user = await this.supabaseService.getCurrentUser();
      if (user) {
        this.user.userName = user.name || 'Unnamed User';
        this.user.profile_image = user.profile_image || 'assets/profile/default-profile.jpg';
        this.user.userEmail = user.email || '';
      }
    } catch (error) {
      console.error('Error fetching user data:', error instanceof Error ? error.message : error);
    }
  }

  onChangeProfilePhoto(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result && typeof reader.result === 'string') {
          this.user.profile_image = reader.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  onChangePassword(): void {
    alert('Password change functionality will be implemented here.');
  }
}