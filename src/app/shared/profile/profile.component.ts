import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/core/interfaces/user.interface';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserService } from 'src/app/core/services/user.service';
import { Register } from 'src/app/core/interfaces/register.interface';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profile: User | null = null;
  showEditModal: boolean = false;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.authService.currentUser$.subscribe({
      next: (user) => {
        if (user) {
          this.profile = {
            userId: user.userId,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            isBlocked: user.isBlocked
          };
          console.log(user);
        } else {
          this.profile = {
            userId: 0,
            fullName: 'Guest User',
            email: 'guest@example.com',
            phoneNumber: 'N/A',
            role: 'Guest',
            isBlocked: false
          };
        }
      },
      error: (err) => {
        console.error('Error fetching user data:', err);
        this.profile = {
          userId: 0,
          fullName: 'Error Loading User',
          email: 'N/A',
          phoneNumber: 'N/A',
          role: 'Guest',
          isBlocked: false
        };
      }
    });
  }

  onEdit() {
    this.showEditModal = true;
  }

  closeModal() {
    this.showEditModal = false;
  }

  onFormSubmit(payload: Register) {
    if (!this.profile?.userId) {
      console.error('No user ID available for update');
      return;
    }

    const updatePayload = {
      fullName: payload.fullName,
      email: payload.email,
      phoneNumber: payload.phoneNumber
    };

    this.userService.updateUser(this.profile.userId, updatePayload).subscribe({
      next: (response) => {
        console.log(response.message);
        this.authService.refreshUserData(this.profile!.userId);
        this.closeModal();
      },
      error: (err) => {
        console.error('Error updating user:', err);
        alert('Failed to update profile: ' + err.message);
      }
    });
  }
}