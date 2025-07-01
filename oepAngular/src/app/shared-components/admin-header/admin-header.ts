import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon' ;

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
