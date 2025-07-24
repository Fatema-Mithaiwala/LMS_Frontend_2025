import { Component, OnInit, HostListener } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  isCollapsed = false;
  isMobile = false;
  isMobileHidden = false;
  isInitialized = false;
  isAdmin = false;
  isLibrarian = false;
  isStudent = false;
  isLoggedIn = false;
  userName = '';

  constructor(
    private auth: AuthService,
    public notificationService: NotificationService,
    private router: Router 
  ) { }

  ngOnInit() {
    this.updateDeviceFlags();
    this.auth.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.isAdmin = user?.role === 'Admin';
      this.isLibrarian = user?.role === 'Librarian';
      this.isStudent = user?.role === 'Student';
      this.userName = user?.fullName || '';
    });
    this.isInitialized = true;
  }

  @HostListener('window:resize')
  onResize() {
    this.updateDeviceFlags();
  }

  updateDeviceFlags() {
    this.isMobile = window.innerWidth < 992;
    if (this.isMobile) {
      this.isCollapsed = false;
      this.isMobileHidden = true;
    }
  }

  toggleSidebar() {
    if (this.isMobile) {
      this.isMobileHidden = !this.isMobileHidden;
    } else {
      this.isCollapsed = !this.isCollapsed;
    }
  }

  onNavClick() {
    if (!this.isMobile && !this.isCollapsed) {
      this.isCollapsed = true; 
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/auth/login');
  }
}