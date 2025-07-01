import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon' ;
import { AdminHeader } from '../../shared-components/admin-header/admin-header';
import { FooterComponent } from '../../shared-components/footer/footer';

@Component({
  standalone: true,
  selector: 'app-admin-home',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    AdminHeader,
    FooterComponent
],
  templateUrl: './admin-home.html',
  styleUrls: ['./admin-home.css']
})
export class AdminHomeComponent {
  constructor(private router: Router) {}

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
}
