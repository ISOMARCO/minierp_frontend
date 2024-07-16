import {Component, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {NgClass, NgForOf} from "@angular/common";
import {DeleteDirective} from "../../directives/ui/delete.directive";
import {CustomersService} from "../../services/models/customers.service";
import {NgxSpinnerService} from "ngx-spinner";
import {InfiniteScrollDirective} from "ngx-infinite-scroll";
import {ModalComponent} from "../../components/modal/modal.component";
import {CreateCustomer} from "../../contracts/customers/create-customer";
import {EditCustomer} from "../../contracts/customers/edit-customer";
import {FilterDirective} from "../../directives/ui/filter/filter.directive";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {FilterCustomer} from "../../contracts/customers/filter-customer";

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    RouterLink,
    NgForOf,
    DeleteDirective,
    InfiniteScrollDirective,
    ModalComponent,
    NgClass,
    FilterDirective,
    ReactiveFormsModule
  ],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss'
})
export class CustomersComponent implements OnInit {
  public form: FormGroup;
  public customers: any = [];
  public createCustomer: CreateCustomer = new CreateCustomer();
  public editCustomer: EditCustomer = new EditCustomer();
  public filterCustomer: FilterCustomer = new FilterCustomer();
  private scrollPosition: number = 0;
  private page: number = 0;
  private pageSize: number = 10;
  private isLoading: boolean = false;
  private noMoreCustomers: boolean = false;
  public isMobile: boolean = false;
  public isSearchVisible: boolean = false;
  constructor(
    private customerService: CustomersService,
    private spinner: NgxSpinnerService
  ) {
    this.form = new FormGroup('');
  }
  async getCustomers(page: number): Promise<void> {
    if (this.isLoading || this.noMoreCustomers) {
      return;
    }
    if(this.page == 0)
      await this.spinner.show();
    const newCustomers = await this.customerService.read(page, this.pageSize, (): void => {
      console.log("Success");
    }, (errorMessage: string): void => {
      console.log(errorMessage);
    });
    if (newCustomers && newCustomers.length > 0) {
      this.customers = [...this.customers, ...newCustomers];
      setTimeout(() => {
        const scrollableContainer: HTMLElement = document.documentElement || document.body;
        scrollableContainer.scrollTop = scrollableContainer.scrollHeight;
      }, 0);
    } else {
      this.noMoreCustomers = true;
      console.log("No more customer");
    }
    this.isLoading = false;
    if(this.page == 0)
      await this.spinner.hide();
    window.scrollTo(0, this.scrollPosition);
  }

  async handleSuccess(): Promise<void> {
    this.customers = [];
    this.page = 0;
    this.noMoreCustomers = false;
    await this.getCustomers(this.page);
  }

  async applyFilter(filteredCustomers: any): Promise<void> {
    this.customers = filteredCustomers;
    this.page = 0;
    this.noMoreCustomers = filteredCustomers.length < this.pageSize;
  }

  async onScroll(): Promise<void> {
    await this.getCustomers(++this.page);
  }

  checkIfMobile() {
    this.isMobile = window.innerWidth <= 768;
  }

  toggleSearch() {
    this.isSearchVisible = !this.isSearchVisible;
  }

  async ngOnInit(): Promise<void> {
    this.checkIfMobile();
    window.addEventListener('resize', this.checkIfMobile.bind(this));
    await this.getCustomers(this.page);
  }
}
