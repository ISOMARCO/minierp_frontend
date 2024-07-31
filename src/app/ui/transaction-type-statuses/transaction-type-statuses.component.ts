import {Component, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {NgxSpinnerComponent, NgxSpinnerService} from "ngx-spinner";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {FilterDirective} from "../../directives/ui/filter/filter.directive";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {InfiniteScrollDirective} from "ngx-infinite-scroll";
import {DeleteDirective} from "../../directives/ui/delete.directive";
import {ModalComponent} from "../../components/modal/modal.component";
import {CreateTransactionTypeStatus} from "../../contracts/transaction-type-statuses/create-transaction-type-status";
import {EditTransactionTypeStatus} from "../../contracts/transaction-type-statuses/edit-transaction-type-status";
import {TransactionTypeStatusesService} from "../../services/models/transaction-type-statuses.service";
import {ListProduct} from "../../contracts/products/list-product";

@Component({
  selector: 'app-transaction-type-statuses',
  standalone: true,
  imports: [
    RouterLink,
    FilterDirective,
    ReactiveFormsModule,
    NgClass,
    NgxSpinnerComponent,
    NgIf,
    InfiniteScrollDirective,
    NgForOf,
    DeleteDirective,
    ModalComponent
  ],
  templateUrl: './transaction-type-statuses.component.html',
  styleUrl: './transaction-type-statuses.component.scss'
})
export class TransactionTypeStatusesComponent implements OnInit{
  public form: FormGroup;
  public transactionTypeStatuses: any = [];
  public isMobile: boolean = false;
  public isSearchVisible: boolean = false;
  private page: number = 0;
  private pageSize: number = 10;
  private scrollPosition: number = 0;
  private isLoading: boolean = false;
  private noMoreTransactionTypeStatuses: boolean = false;
  public createTransactionTypeStatus: CreateTransactionTypeStatus = new CreateTransactionTypeStatus();
  public editTransactionTypeStatus: EditTransactionTypeStatus = new EditTransactionTypeStatus();

  constructor(
    private spinner: NgxSpinnerService,
    private readonly transactionTypeStatusesService: TransactionTypeStatusesService
  ) {
    this.form = new FormGroup('');
  }

  async getTransactionTypeStatuses(page: number): Promise<void> {
    if (this.isLoading || this.noMoreTransactionTypeStatuses) {
      return;
    }
    this.isLoading = true;
    if(this.page == 0)
      await this.spinner.show();
    const newTransactionTypeStatuses: ListProduct[]|undefined =  await this.transactionTypeStatusesService.read(page, this.pageSize, (): void => {
      console.log("Success");
    }, (errorMessage: string): void =>{
      console.error(errorMessage);
    });
    if (newTransactionTypeStatuses && newTransactionTypeStatuses.length > 0) {
      this.transactionTypeStatuses = [...this.transactionTypeStatuses, ...newTransactionTypeStatuses];
      setTimeout(() => {
        const scrollableContainer = document.documentElement || document.body;
        scrollableContainer.scrollTop = scrollableContainer.scrollHeight;
      }, 0);
    } else {
      this.noMoreTransactionTypeStatuses = true;
      console.log("No more product");
    }
    this.isLoading = false;
    if(this.page == 0)
      await this.spinner.hide();
    window.scrollTo(0, this.scrollPosition);
  }

  checkIfMobile(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  toggleSearch(): void {
    this.isSearchVisible = !this.isSearchVisible;
  }

  async onScroll(): Promise<void> {
    await this.getTransactionTypeStatuses(++this.page);
  }

  async handleSuccess(): Promise<void> {
    this.transactionTypeStatuses = [];
    this.page = 0;
    this.noMoreTransactionTypeStatuses = false;
    await this.getTransactionTypeStatuses(this.page);
  }

  async applyFilter(filteredProducts: any): Promise<void> {
    this.transactionTypeStatuses = filteredProducts;
    this.page = 0;
    this.noMoreTransactionTypeStatuses = filteredProducts.length < this.pageSize;
  }

  async ngOnInit(): Promise<void> {
    this.checkIfMobile();
    window.addEventListener('resize', this.checkIfMobile.bind(this));
    await this.getTransactionTypeStatuses(this.page);
  }
}
