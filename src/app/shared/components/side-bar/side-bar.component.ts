import { Component, CUSTOM_ELEMENTS_SCHEMA, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarServiceService } from '../../../core/services/SidebarService/sidebar-service.service';

interface MenuItem {
  label: string;
  icon?: string;
  route: string;  
  svgIcon?: string;
  children?: MenuItem[];  // Optional sub-menu items
}

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {
  @Output() collapsedChange = new EventEmitter<boolean>();
  isCollapsed: boolean = false;
  isDropdownOpen: { [key: string]: boolean } = {};  // Track dropdown state

  title: string = ''; // New title property
  userName: string | null = ''; // Initialize as empty
  profileImageUrl: string = 'assets/profile/default-profile.jpg'; // Default profile image
  userRole: string | null = '';

  AdminMenu: MenuItem[] = [
    {
      label: 'DASHBOARD',
      icon: 'ic:sharp-dashboard',
      route: '/admin/dashboard',
    },
    {
      label: 'DOCUMENTS',
      icon: 'ic:sharp-description',
      route: '/admin/a-documents',
    },
    { label: 'INCOMING', 
      icon: 'ic:sharp-move-to-inbox', 
      route: '/admin/a-incoming' 
    },
    {
      label: 'RECEIVED',
      icon: 'ri:folder-received-fill',
      route: '/admin/a-received',
    },
    {
      label: 'OUTGOING',
      icon: 'ic:sharp-shortcut',
      route: '/admin/a-outgoing',
    },
    {
      label: 'COMPLETED',
      icon: 'ic:sharp-check-circle',
      route: '/admin/a-completed',
    },
    {
      label: 'REPORTS',
      icon: 'ic:baseline-assessment',
      route: '/admin/a-reports',
    },
    {
      label: 'SYSTEM SETTINGS',
      icon: 'ic:baseline-settings',
      route: '',  // Empty route since it will have sub-items
      children: [
        {
          label: 'USERS',
          icon: 'ic:baseline-manage-accounts',
          route: '/admin/user-management',
        },
        {
          label: 'OFFICE',
          icon: 'ic:baseline-business',
          route: '/admin/office-management',
        },
        {
          label: 'CATEGORY',
          icon: 'ic:baseline-category',
          route: '/admin/category-management',
        },
      ]
    },
    {
      label: 'E-logs',
      icon: 'ic:baseline-list-alt',
      route: '/admin/a-logs',
    },
  ];

  UserMenu: MenuItem[] = [
    {
      label: 'DASHBOARD',
      icon: 'ic:sharp-dashboard',
      route: '/user/dashboard',
    },
    {
      label: 'DOCUMENTS',
      icon: 'ic:sharp-description',
      route: '/user/documents',
    },
    { label: 'INCOMING', 
      icon: 'ic:sharp-move-to-inbox', 
      route: '/user/incoming',
    },
    {
      label: 'RECEIVED',
      icon: 'ri:folder-received-fill',
      route: '/user/received',
    },
    {
      label: 'OUTGOING',
      icon: 'cib:telegram-plane',
      route: '/user/outgoing',
    },
    {
      label: 'COMPLETED',
      icon: 'ic:sharp-check-circle',
      route: '/user/completed',
    },
    {
      label: 'REPORTS',
      icon: 'ic:baseline-list-alt',
      route: '/user/e-logs',
    },
  ];

  generalMenu: MenuItem[] = [
    // { label: 'Report a Problem', icon: 'ic:baseline-report-problem', route: '/report' },
    { label: 'Sign Out', icon: 'ic:outline-logout', route: '/login' },
  ];

  currentMenu: MenuItem[] = [];
  othersMenu: MenuItem[] = [];

  constructor(private router: Router, private sidebarService: SidebarServiceService) {}

  ngOnInit() {
    this.setMenuByRole();
    this.sidebarService.isCollapsed$.subscribe(
      isCollapsed => {
        this.isCollapsed = isCollapsed;
        this.collapsedChange.emit(this.isCollapsed);
      }
    );
  }

  toggleDropdown(label: string): void {
    this.isDropdownOpen[label] = !this.isDropdownOpen[label];
  }

  setMenuByRole() {
    const userRole = localStorage.getItem('userRole') as 'user' | 'admin';
    console.log('User Role:', userRole);
    switch (userRole) {
      case 'user':
        this.currentMenu = [...this.UserMenu];
        this.title = 'Document Management System'; // Set title for user menu
        break;
      case 'admin':
        this.currentMenu = [...this.AdminMenu];
        this.title = 'Admin Portal'; // Set title for admin menu
        break;
      default:
        console.error('Invalid role');
        this.router.navigate(['/login']);
    }
    this.othersMenu = [...this.generalMenu];
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

  signOut() {
    localStorage.removeItem('userRole');
    this.router.navigate(['/login']);
  }

  getMenuItemClasses(): string {
    return `flex items-center py-3 px-4 rounded-lg cursor-pointer transition-colors duration-200 glassmorph group ${this.isCollapsed ? 'justify-center' : ''}`;
  }

  getTextClasses(): string {
    return this.isCollapsed ? 'hidden sidebar-hover-text' : 'block sidebar-text';
  }

  isActive(route: string): boolean {
    return this.router.isActive(route, {
      paths: 'exact',
      queryParams: 'exact',
      fragment: 'ignored',
      matrixParams: 'ignored'
    });
  }

  navigateToProfile() {
    // Navigate based on the user's role
    if (this.userRole === 'admin') {
      this.router.navigate(['/admin/a-profile']);
    } else {
      this.router.navigate(['/user/u-profile']);
    }
  }
}
