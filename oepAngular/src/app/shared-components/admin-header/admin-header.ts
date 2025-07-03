import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon' ;
import { AuthService } from '../../services/auth';
import { UserService } from '../../services/user-service';
import { UserProfile } from '../../services/user-service';
import { MatDialog } from '@angular/material/dialog';
import { UpdateProfileDialogComponent } from '../../auth/update-profile/update-profile-dialog';

@Component({
  selector: 'app-admin-header',
  imports: [RouterModule,
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule
  ],
  templateUrl: './admin-header.html',
  styleUrl: './admin-header.css'
})
export class AdminHeader {

  constructor(private router: Router,private dialog: MatDialog,
      private authService: AuthService,
      private userService: UserService) {}

  user: UserProfile | null = null;

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.authService.getProfile().subscribe(
        (userData) => {
          this.user = userData;
        },
        (error) => {
          console.error('Failed to fetch user details:', error);
        }
      );
    }
  }

  goToManageExams() {
    this.router.navigate(['/admin/manage-exams']);
  }

  goToManageQuestions() {
    this.router.navigate(['question-bank']);
  }

  goToReports() {
    this.router.navigate(['/admin/reports']);
  }
  goToManageUsers() {
    this.router.navigate(['manage-users']);
  }

  updateProfile(): void {
      this.router.navigate(['/update-profile']);
    }
  
    logout(): void {
      localStorage.clear();
      //localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }
  
    openUpdateProfileDialog() {
      const dialogRef = this.dialog.open(UpdateProfileDialogComponent, {
        width: '400px',
        data: {
          name: this.user?.name || '',
          email: this.user?.email || ''
        }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          console.log('Updated user:', result);
          this.ngOnInit(); // Refresh profile
        }
      });
    }
}
