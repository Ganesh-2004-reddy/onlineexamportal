import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { RoleService } from '../services/role/role-service';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    FormsModule
  ],
  templateUrl: './manage-users.html',
  styleUrls: ['./manage-users.css']
})
export class ManageUsersComponent implements OnInit {
  roles = ['ADMIN', 'STUDENT', 'EXAMINER'];
  users: any[] = [];

  constructor(private roleService: RoleService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.roleService.getUsers().subscribe({
      next: data => this.users = data,
      error: err => alert('Failed to load users: ' + err.message)
    });
  }

  updateRole(userId: number, newRole: string) {
    this.roleService.updateUserRole(userId, newRole).subscribe({
      next: () => {
        const user = this.users.find(u => u.userId === userId);
        if (user) user.role = newRole;
        alert(`Updated role for user ID ${userId} to ${newRole}`);
      },
      error: err => alert('Failed to update role: ' + err.message)
    });
  }
}
