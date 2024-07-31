import {Component, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {NgxSpinnerComponent, NgxSpinnerService} from "ngx-spinner";
import {InfiniteScrollDirective} from "ngx-infinite-scroll";
import {TransactionTypesService} from "../../services/models/transaction-types.service";
import {HttpErrorResponse} from "@angular/common/http";
import {FilterDirective} from "../../directives/ui/filter/filter.directive";
import {FilterTransactionType} from "../../contracts/transaction-types/filter-transaction-type";
import {ModalComponent} from "../../components/modal/modal.component";
import {CreateTransactionType} from "../../contracts/transaction-types/create-transaction-type";
import {EditTransactionType} from "../../contracts/transaction-types/edit-transaction-type";
import {DeleteDirective} from "../../directives/ui/delete.directive";
import {ListTransactionTypes} from "../../contracts/transaction-types/list-transaction-types";

@Component({
  selector: 'app-transaction-types',
  standalone: true,
  imports: [
    RouterLink,
    NgClass,
    NgxSpinnerComponent,
    NgIf,
    InfiniteScrollDirective,
    NgForOf,
    FilterDirective,
    ReactiveFormsModule,
    ModalComponent,
    DeleteDirective
  ],
  templateUrl: './transaction-types.component.html',
  styleUrl: './transaction-types.component.scss'
})
export class TransactionTypesComponent implements OnInit{
  form: FormGroup;
  transactionTypes: any = [];
  statuses: any = [];
  private scrollPosition: number = 0;
  private page: number = 0;
  private pageSize: number = 10;
  private isLoading: boolean = false;
  private noMoreTransactionTypes: boolean = false;
  public isMobile: boolean = false;
  public isSearchVisible: boolean = false;
  public filterTransactionType: FilterTransactionType = new FilterTransactionType();
  public createTransactionType: CreateTransactionType = new CreateTransactionType();
  public editTransactionType: EditTransactionType = new EditTransactionType();
  constructor(
    private transactionTypeService: TransactionTypesService,
    private spinner: NgxSpinnerService
  ) {
    this.form = new FormGroup('');
  }
  checkIfMobile() {
    this.isMobile = window.innerWidth <= 768;
  }

  toggleSearch() {
    this.isSearchVisible = !this.isSearchVisible;
  }

  async applyFilter(filteredProducts: any): Promise<void> {
    this.transactionTypes = filteredProducts;
    this.page = 0;
    this.noMoreTransactionTypes = filteredProducts.length < this.pageSize;
  }

  async getTransactionTypes(page: number): Promise<void> {
    if (this.isLoading || this.noMoreTransactionTypes) {
      return;
    }
    this.isLoading = true;
    if(this.page == 0)
      this.spinner.show();
    const newTransactionTypes: ListTransactionTypes[]|undefined = await this.transactionTypeService.read(page, this.pageSize, () => {
      console.log("Success");
    }, (errorMessage: string) => {
      console.error(errorMessage);
    });
    this.statuses = [...this.statuses, this.transactionTypeService.statuses()];
    if (newTransactionTypes && newTransactionTypes.length > 0) {
      this.transactionTypes = [...this.transactionTypes, ...newTransactionTypes];
      setTimeout(() => {
        const scrollableContainer = document.documentElement || document.body;
        scrollableContainer.scrollTop = scrollableContainer.scrollHeight;
      }, 0);
    } else {
      this.noMoreTransactionTypes = true;
      console.log("No more transaction type");
    }
    this.isLoading = false;
    if(this.page == 0)
      await this.spinner.hide();
    window.scrollTo(0, this.scrollPosition);
  }

  async onScroll(): Promise<void> {
    await this.getTransactionTypes(++this.page);
  }

  async handleSuccess(): Promise<void> {
    this.transactionTypes = [];
    this.page = 0;
    this.noMoreTransactionTypes = false;
    await this.getTransactionTypes(this.page);
  }

  async ngOnInit(): Promise<void> {
    this.checkIfMobile();
    window.addEventListener('resize', this.checkIfMobile.bind(this));
    await this.getTransactionTypes(this.page);
  }
}
