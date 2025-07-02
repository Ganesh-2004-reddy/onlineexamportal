import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatCardTitle } from '@angular/material/card';
import { AuthService } from '../../../services/auth';
import { UserProfile } from '../../../services/user-service';
import { FooterComponent } from '../../../shared-components/footer/footer';
import { ExaminerHeaderComponent } from '../../../shared-components/examiner-header/examiner-header';

@Component({
  selector: 'app-examiner-home',
  imports: [CommonModule, RouterModule, MatButtonModule,ExaminerHeaderComponent, FooterComponent,MatCardTitle, MatCard, RouterLink],
  templateUrl: './examiner-home.html',
  styleUrl: './examiner-home.css'
})
export class ExaminerHome {
  user: UserProfile | null = null;

   constructor(
      private authService: AuthService,
    ) {}

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

}
