import {Component, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {UsersService} from "../../services/models/users.service";
import {NgForOf} from "@angular/common";
import {DeleteDirective} from "../../directives/ui/delete.directive";
@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    RouterLink,
    NgForOf,
    DeleteDirective
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit{
  users: any = [];
  constructor(private readonly userService: UsersService) {}
  async getUsers(): Promise<void> {
    this.users = await this.userService.read((): void => {
      console.log("Success");
    }, (errorMessage: string): void =>{
      console.error(errorMessage);
    });
  }
  async ngOnInit(): Promise<void> {
    await this.getUsers();
  }
}
