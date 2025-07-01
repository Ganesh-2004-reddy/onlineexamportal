import { Component } from '@angular/core';
import { ExaminerHeaderComponent } from '../../../../shared-components/examiner-header/examiner-header';
import { FooterComponent } from '../../../../shared-components/footer/footer';
@Component({
  selector: 'app-view-report',
  imports: [ExaminerHeaderComponent,FooterComponent],
  templateUrl: './view-report.html',
  styleUrl: './view-report.css'
})
export class ViewReport {

}
