import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReportSummaryDTO {
  reportId: number;
  examId: number;
  userId: any;
  totalMarks: number;
  performanceMetrics: string;
}

@Injectable({ providedIn: 'root' })
export class ReportService {
  private baseUrl = 'http://localhost:8090/analytics/reports';

  constructor(private http: HttpClient) {}

  getAllReports(): Observable<ReportSummaryDTO[]> {
    return this.http.get<ReportSummaryDTO[]>(`${this.baseUrl}`);
  }

  getReportsByUser(userId: number): Observable<ReportSummaryDTO[]> {
    return this.http.get<ReportSummaryDTO[]>(`${this.baseUrl}/user/${userId}`);
  }

  getReportByUserAndExam(userId: number, examId: number): Observable<ReportSummaryDTO> {
    return this.http.get<ReportSummaryDTO>(`${this.baseUrl}/user/${userId}/exam/${examId}`);
  }

  getTopper(): Observable<ReportSummaryDTO> {
    return this.http.get<ReportSummaryDTO>(`${this.baseUrl}/topper`);
  }

  getRank(userId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/rank?userId=${userId}`);
  }

  getExamCount(userId: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/user/${userId}/examCount`);
  }

  deleteReport(userId?: number, examId?: number): Observable<any> {
    let url = `${this.baseUrl}`;
    const params: string[] = [];
    if (userId !== undefined) params.push(`userId=${userId}`);
    if (examId !== undefined) params.push(`examId=${examId}`);
    if (params.length) url += `?${params.join('&')}`;
    return this.http.delete(url);
  }

  deleteAllReports(): Observable<any> {
    return this.http.delete(`${this.baseUrl}/all`);
  }
}