// view-students.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { RoleService } from '../../../../services/role/role-service';
import { UserProfile } from '../../../../services/user-service';
import { ExaminerHeaderComponent } from '../../../../shared-components/examiner-header/examiner-header';
import { FooterComponent } from '../../../../shared-components/footer/footer';
@Component({
  selector: 'app-view-students',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule,ExaminerHeaderComponent,FooterComponent],
  templateUrl: './view-student.html',
  styleUrls: ['./view-student.css']
})
export class ViewStudentsComponent implements OnInit {
  users: UserProfile[] = [];
  displayedColumns: string[] = ['id', 'name', 'email'];

  constructor(private roleService: RoleService) {}

  userId = localStorage.getItem('userId');

  ngOnInit(): void {
    this.loadUsers();
  }
    loadUsers() {
    this.roleService.getUsers().subscribe({
      next: data => this.users = data.filter(user => user.role === 'STUDENT'),
      error: err => alert('Failed to load users: ' + err.message)
    });
  }
}
