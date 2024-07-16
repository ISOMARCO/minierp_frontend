import {Component, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {UsersService} from "../../services/models/users.service";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {DeleteDirective} from "../../directives/ui/delete.directive";
import {ModalDirective} from "../../directives/ui/modal.directive";
import {ModalComponent} from "../../components/modal/modal.component";
import {CreateUser} from "../../contracts/users/create-user";
import {NgxSpinnerComponent, NgxSpinnerService} from "ngx-spinner";
import {EditUser} from "../../contracts/users/edit-user";
import {InfiniteScrollDirective} from "ngx-infinite-scroll";
import {FilterDirective} from "../../directives/ui/filter/filter.directive";
import {FilterUser} from "../../contracts/users/filter-user";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    RouterLink,
    NgForOf,
    DeleteDirective,
    ModalDirective,
    ModalComponent,
    NgxSpinnerComponent,
    InfiniteScrollDirective,
    NgClass,
    NgIf,
    FilterDirective,
    ReactiveFormsModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit{
  public form: FormGroup;
  public users: any = [];
  public createUser: CreateUser = new CreateUser();
  public editUser: EditUser = new EditUser();
  public filterUser: FilterUser = new FilterUser();
  private scrollPosition: number = 0;
  private page: number = 0;
  private pageSize: number = 10;
  private isLoading: boolean = false;
  private noMoreUsers: boolean = false;
  public isMobile: boolean = false;
  public isSearchVisible: boolean = false;
  constructor(
    private readonly userService: UsersService,
    private readonly spinner: NgxSpinnerService
    ) {
    this.form = new FormGroup('');
  }
  async getUsers(page: number): Promise<void> {
    if (this.isLoading || this.noMoreUsers) {
      return;
    }
    this.isLoading = true;
    if(this.page == 0)
      await this.spinner.show();
    const newUsers =  await this.userService.read(page, this.pageSize, (): void => {
      console.log("Success");
    }, (errorMessage: string): void =>{
      console.error(errorMessage);
    });
    if (newUsers && newUsers.length > 0) {
      this.users = [...this.users, ...newUsers];
      setTimeout(() => {
        const scrollableContainer = document.documentElement || document.body;
        scrollableContainer.scrollTop = scrollableContainer.scrollHeight;
      }, 0);
    } else {
      this.noMoreUsers = true;
      console.log("No more user");
    }
    this.isLoading = false;
    if(this.page == 0)
      await this.spinner.hide();
    window.scrollTo(0, this.scrollPosition);
  }

  async applyFilter(filteredUsers: any): Promise<void> {
    this.users = filteredUsers;
    this.page = 0;
    this.noMoreUsers = filteredUsers.length < this.pageSize;
  }

  async handleSuccess(): Promise<void> {
    this.users = [];
    this.page = 0;
    this.noMoreUsers = false;
    await this.getUsers(this.page);
  }

  async onScroll(): Promise<void> {
    await this.getUsers(++this.page);
  }

  checkIfMobile() {
    this.isMobile = window.innerWidth <= 768;
  }

  toggleSearch() {
    this.isSearchVisible = !this.isSearchVisible;
  }

  async ngOnInit(): Promise<void> {
    await this.getUsers(this.page);
    this.checkIfMobile();
    window.addEventListener('resize', this.checkIfMobile.bind(this));
  }
}
