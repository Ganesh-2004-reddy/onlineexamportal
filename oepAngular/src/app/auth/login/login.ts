import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['',[Validators.required,Validators.minLength(8)]]
    });
  }

  onSubmit() {
  if (this.loginForm.invalid) return;

  this.auth.login(this.loginForm.value).subscribe({
    next: res => {
      if (res.role === 'ADMIN') {
        this.router.navigate(['/admin-home']);
      } else if (res.role === 'STUDENT') {
        this.router.navigate(['/student-home']);
      } else if (res.role === 'EXAMINER') {
        this.router.navigate(['/examiner-home']);
      } else {
        alert('Unknown role. Please contact support.');
      }
    }
  });
}

}
