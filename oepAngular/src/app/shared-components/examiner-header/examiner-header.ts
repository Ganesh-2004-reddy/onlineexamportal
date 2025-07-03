import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { UserService } from '../../services/user-service';
import { MatDialog } from '@angular/material/dialog';
import { UserProfile } from '../../services/user-service';
import { UpdateProfileDialogComponent } from '../../auth/update-profile/update-profile-dialog';

@Component({
  selector: 'app-examiner-header',
  standalone: true,
  imports: [RouterModule, MatToolbarModule, MatIconModule, MatMenuModule, MatButtonModule],
  templateUrl: './examiner-header.html',
  styleUrls: ['./examiner-header.css']
})
export class ExaminerHeaderComponent {

  user: UserProfile | null = null;

  constructor(private router: Router,  private dialog: MatDialog,
    private authService: AuthService,
    private userService: UserService) {}


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

  updateProfile(): void {
    this.router.navigate(['/update-profile']);
  }

  logout(): void {
    localStorage.clear();
    // Optionally, you can clear the token if it's stored separately
   // localStorage.removeItem('token');
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
