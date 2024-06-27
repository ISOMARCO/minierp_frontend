import {Component, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {UsersService} from "../../services/models/users.service";
import {NgForOf} from "@angular/common";
import {DeleteDirective} from "../../directives/ui/delete.directive";
import {ModalDirective} from "../../directives/ui/modal.directive";
import {ModalComponent} from "../../components/modal/modal.component";
import {CreateUser} from "../../contracts/create-user";
import {NgxSpinnerComponent, NgxSpinnerService} from "ngx-spinner";
import {EditUser} from "../../contracts/edit-user";
@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    RouterLink,
    NgForOf,
    DeleteDirective,
    ModalDirective,
    ModalComponent,
    NgxSpinnerComponent
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit{
  users: any = [];
  createUser: CreateUser = new CreateUser();
  editUser: EditUser = new EditUser();
  constructor(
    private readonly userService: UsersService,
    private readonly spinner: NgxSpinnerService
    ) {}
  async getUsers(): Promise<void> {
    await this.spinner.show();
    this.users = await this.userService.read((): void => {
      console.log("Success");
    }, (errorMessage: string): void =>{
      console.error(errorMessage);
    });
    await this.spinner.hide();
  }
  async ngOnInit(): Promise<void> {
    await this.getUsers();
  }
}
