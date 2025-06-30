// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-admin-home',
//   imports: [CommonModule],
//   templateUrl: './admin-home.html',
//   styleUrl: './admin-home.css'
// })
// export class AdminHomeComponent {

// }

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon' ;

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
    MatIconModule
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
