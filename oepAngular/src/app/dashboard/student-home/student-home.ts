import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth';
import { UserProfile } from '../../services/user-service';
import { UserHeaderComponent } from '../../shared-components/user-header/user-header';
import { FooterComponent } from '../../shared-components/footer/footer';


@Component({
  selector: 'app-student-home',
  templateUrl: './student-home.html',
  styleUrls: ['./student-home.css'],
  imports:[CommonModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    RouterModule,
    UserHeaderComponent,
    FooterComponent
    ]
})
export class StudentHomeComponent implements OnInit {
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
