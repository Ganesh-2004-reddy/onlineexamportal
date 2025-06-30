import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar'; // For notifications
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
  roles = ['ADMIN', 'STUDENT', 'EXAMINER']; // Available roles
  users: any[] = []; // List of users

  constructor(private roleService: RoleService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.loadUsers();
  }

  // Load users from the backend
  loadUsers() {
    this.roleService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        this.snackBar.open('Failed to load users: ' + err.message, 'Close', { duration: 3000 });
      }
    });
  }

  // Update user role
  updateRole(userId: number, newRole: string) {
    this.roleService.updateUserRole(userId, newRole).subscribe({
      next: () => {
        const user = this.users.find((u) => u.userId === userId);
        if (user) user.role = newRole; // Update the role locally
        this.snackBar.open(`Role updated successfully for user ID ${userId}`, 'Close', { duration: 3000 });
      },
      error: (err) => {
        this.snackBar.open('Failed to update role: ' + err.message, 'Close', { duration: 3000 });
      }
    });
  }

  // Delete user
  deleteUser(userId: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.roleService.deleteUser(userId).subscribe({
        next: () => {
          this.users = this.users.filter((user) => user.userId !== userId); // Remove user from the list
          this.snackBar.open('User deleted successfully', 'Close', { duration: 3000 });
        },
        error: (err) => {
          this.snackBar.open('Failed to delete user: ' + err.message, 'Close', { duration: 3000 });
        }
      });
    }
  }
}
