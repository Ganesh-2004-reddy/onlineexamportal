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
import { AdminReportsComponent } from './admin-report/report/report';
import { StudentReportsComponent } from './student-report/report/report';
import { landingPageComponent } from './landing-page/landing-page';

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
    component: AdminReportsComponent,
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


  //{ path: 'exam/:examId', component: AttemptExamComponent },     // To be created
  { path: 'results', component: ResultsComponent },               // To be created
  //{ path: 'update-profile', component: UpdateProfileComponent }, // To be created

];

export const appRouting = provideRouter(appRoutes);
