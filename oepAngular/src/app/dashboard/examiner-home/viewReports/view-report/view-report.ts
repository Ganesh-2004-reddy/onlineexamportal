import { Component, OnInit } from '@angular/core';
import { ReportService, ReportSummaryDTO } from '../../../../services/report/report-service.service'; // Adjust path if necessary
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-report',
  standalone: true,
  imports: [
    MatTableModule,
    MatCardModule,
    MatSnackBarModule,
    CommonModule
  ],
  templateUrl: './view-report.html',
  styleUrls: ['./view-report.css']
})
export class ViewReportComponent implements OnInit {
  reports: ReportSummaryDTO[] = []; // Holds the list of reports

  constructor(private reportService: ReportService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.reportService.getAllReports().subscribe(
      res => {
        this.reports = res; // Populate the reports array
      },
      err => {
        this.snackBar.open('Error loading reports', 'Close', { duration: 3000 });
      }
    );
  }
}
