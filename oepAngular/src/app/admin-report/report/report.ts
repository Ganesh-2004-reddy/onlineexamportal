import { Component, OnInit } from '@angular/core';
import { ReportService, ReportSummaryDTO } from '../../services/report/report-service.service'; // Adjust path if necessary
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Explicitly import CommonModule
import { AdminHeader } from '../../shared-components/admin-header/admin-header';
import { FooterComponent } from '../../shared-components/footer/footer'; // Import footer component if needed

@Component({
  selector: 'app-admin-report',
  standalone: true,
  imports: [
    CommonModule, // Required for *ngIf and *ngFor (used implicitly by mat-table)
    FormsModule,  // Required for [(ngModel)]
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatSnackBarModule,
    MatFormFieldModule,
    AdminHeader, // Include the admin header component
    FooterComponent // Include the footer component if needed
  ],
  templateUrl: './report.html', // Assuming the HTML file is now named 'report.html'
  styleUrls: ['./report.css'] // Ensure this path is correct
})
export class AdminReportComponent implements OnInit {
  reports: ReportSummaryDTO[] = []; // This will hold the currently displayed (filtered) reports
  allReports: ReportSummaryDTO[] = []; // This will hold all reports fetched from the backend (unfiltered)
  topper?: ReportSummaryDTO;

  userIdToDelete?: number; // Existing property for delete functionality
  examIdToDelete?: number; // Existing property for delete functionality

  filterUserId?: number; // New property for filtering by User ID
  filterExamId?: number; // New property for filtering by Exam ID

  constructor(private reportService: ReportService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadAllReports(); // Load all reports initially
    this.loadTopper();
  }

  // Loads all reports from the backend and stores them in allReports
  // Then, it sets the 'reports' (displayed list) to 'allReports' initially
  loadAllReports(): void {
    this.reportService.getAllReports().subscribe(
      res => {
        this.allReports = res; // Store the complete list
        this.reports = res;    // Initialize displayed reports with all reports
      },
      err => this.snackBar.open('No reports found to load', 'Close', { duration: 3000 })
    );
  }

  loadTopper(): void {
    this.reportService.getTopper().subscribe(
      res => this.topper = res,
     err => this.snackBar.open('Topper not declared yet', 'Close', { duration: 3000 })
    );
  }

  deleteReports(): void {
    if (confirm('Are you sure you want to delete selected reports?')) {
      this.reportService.deleteReport(this.userIdToDelete, this.examIdToDelete).subscribe(
        () => {
          this.snackBar.open('Deleted successfully', 'Close', { duration: 3000 });
          this.userIdToDelete = undefined; // Clear inputs
          this.examIdToDelete = undefined;
          this.loadAllReports(); // Reload all reports to update the table
        },
        err => this.snackBar.open('Delete failed', 'Close', { duration: 3000 })
      );
    }
  }

  deleteAll(): void {
    if (confirm('Are you sure to delete all reports? This action cannot be undone!')) {
      this.reportService.deleteAllReports().subscribe(
        () => {
          this.snackBar.open('All reports deleted', 'Close', { duration: 3000 });
          this.loadAllReports(); // Reload all reports after mass deletion
        },
        err => this.snackBar.open('Failed to delete all reports', 'Close', { duration: 3000 })
      );
    }
  }

  // New method to apply filters to the reports
  applyFilters(): void {
    let filteredReports = this.allReports; // Start with the complete list

    // Apply filter by User ID if provided
    if (this.filterUserId !== undefined && this.filterUserId !== null) {
      filteredReports = filteredReports.filter(report => report.userId === this.filterUserId);
    }

    // Apply filter by Exam ID if provided
    if (this.filterExamId !== undefined && this.filterExamId !== null) {
      filteredReports = filteredReports.filter(report => report.examId === this.filterExamId);
    }

    this.reports = filteredReports; // Update the displayed reports
    if (this.reports.length === 0) {
      this.snackBar.open('No reports found matching your filter criteria.', 'Close', { duration: 3000 });
    }
  }

  // New method to clear filters and display all reports again
  clearFilters(): void {
    this.filterUserId = undefined;
    this.filterExamId = undefined;
    this.reports = this.allReports; // Reset to show all original reports
    this.snackBar.open('Filters cleared.', 'Close', { duration: 3000 });
  }
}
