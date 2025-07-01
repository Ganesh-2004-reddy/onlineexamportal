import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register';
import { AdminHomeComponent } from './dashboard/admin-home/admin-home';
import { StudentHomeComponent } from './dashboard/student-home/student-home';
import { ExamsComponent } from './exam/exams';
import { ExamAttemptComponent } from './exam/exam-attempt';
import { ResultsComponent } from './result/results';
import { ManageExamsComponent } from './dashboard/admin-home/manage-exams';
import { ManageQuestionsComponent } from './admin/manage-questions';
import { ManageUsersComponent } from './admin/manage-users';
import { QuestionBankComponent } from './questionBank/question-bank/question-bank';
import { AuthGuard } from './guards/auth-guard';
import { AdminReportComponent } from './admin-report/report/report';
import { StudentReportsComponent } from './student-report/report/report';
import { landingPageComponent } from './landing-page/landing-page';
import { ExaminerHome } from './dashboard/examiner-home/examiner-home/examiner-home';
import { ViewStudentsComponent } from './dashboard/examiner-home/viewStudent/view-student/view-student';
import { ViewExamsComponent } from './dashboard/examiner-home/viewExams/view-exams/view-exams';
import { ViewReportComponent } from './dashboard/examiner-home/viewReports/view-report/view-report';


export const appRoutes: Routes = [
  { path: '', redirectTo: 'landing-page', pathMatch: 'full' },
  { path: 'landing-page',component: landingPageComponent},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'admin-home',
    component: AdminHomeComponent,
    canActivate: [AuthGuard],
    data: { role: 'ADMIN' }
  },
 {
    path:'admin/manage-exams',
    component:ManageExamsComponent,
 },
  {
    path: 'student-home',
    component: StudentHomeComponent,
    canActivate: [AuthGuard],
    data: { role: 'STUDENT' }
  },
  {
    path: 'admin/reports',
    component: AdminReportComponent,
    canActivate: [AuthGuard],
    data: { role: 'ADMIN' }
  },
  {
    path: 'reports',
    component: StudentReportsComponent,
    // canActivate: [AuthGuard],
    // data: { role: 'STUDENT' }
  },
  {path:'manage-users',component:ManageUsersComponent},
  { path: 'exams', component: ExamsComponent },
  { path: 'exam/:id', component: ExamAttemptComponent },
  { path: 'results', component: ResultsComponent },
  {
  path: 'results/:examId',
  component: ResultsComponent
},
  {
  path: 'admin/questions/:examId',
  component: ManageQuestionsComponent
},
{
  path: 'question-bank',
  component: QuestionBankComponent
},

{ path: 'results', component: ResultsComponent }, 

{
  path: 'examiner-home',
  component: ExaminerHome,
  canActivate: [AuthGuard],
  data: { role: 'EXAMINER' } 
},
{ path: 'examiner/students', component: ViewStudentsComponent },
{ path: 'examiner/exams', component: ViewExamsComponent },
{ path: 'examiner/reports', component: ViewReportComponent }           


];

export const appRouting = provideRouter(appRoutes);
