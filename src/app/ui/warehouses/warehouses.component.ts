import {Component, OnInit} from '@angular/core';
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {NgxSpinnerComponent, NgxSpinnerService} from "ngx-spinner";
import {WarehousesService} from "../../services/models/warehouses.service";
import {RouterLink} from "@angular/router";
import {FilterDirective} from "../../directives/ui/filter/filter.directive";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {FilterWarehouse} from "../../contracts/warehouses/filter-warehouse";
import {InfiniteScrollDirective} from "ngx-infinite-scroll";
import {DeleteDirective} from "../../directives/ui/delete.directive";
import {ModalComponent} from "../../components/modal/modal.component";
import {EditWarehouse} from "../../contracts/warehouses/edit-warehouse";
import {CreateWarehouse} from "../../contracts/warehouses/create-warehouse";
import {ListWarehouse} from "../../contracts/warehouses/list-warehouse";

@Component({
  selector: 'app-warehouses',
  standalone: true,
  imports: [
    RouterLink,
    FilterDirective,
    NgClass,
    ReactiveFormsModule,
    NgxSpinnerComponent,
    NgIf,
    InfiniteScrollDirective,
    NgForOf,
    DeleteDirective,
    ModalComponent
  ],
  templateUrl: './warehouses.component.html',
  styleUrl: './warehouses.component.scss'
})
export class WarehousesComponent implements OnInit{
  form: FormGroup;
  warehouses: any = [];
  private scrollPosition: number = 0;
  private page: number = 0;
  private pageSize: number = 10;
  private isLoading: boolean = false;
  private noMoreWarehouses: boolean = false;
  public isMobile: boolean = false;
  public isSearchVisible: boolean = false;
  public filterWarehouse: FilterWarehouse = new FilterWarehouse();
  public editWarehouse: EditWarehouse = new EditWarehouse();
  public createWarehouse: CreateWarehouse = new CreateWarehouse();

  constructor(
    private spinner: NgxSpinnerService,
    private readonly warehouseService: WarehousesService
  ) {
    this.form = new FormGroup({});
  }
  async getWarehouses(page: number): Promise<void> {
    if (this.isLoading || this.noMoreWarehouses) {
      return;
    }
    this.isLoading = true;
    if(this.page == 0)
      await this.spinner.show();
    const newWarehouses: ListWarehouse[]|undefined =  await this.warehouseService.read(page, this.pageSize, (): void => {
      console.log("Success");
    }, (errorMessage: string): void =>{
      console.error(errorMessage);
    });
    if (newWarehouses && newWarehouses.length > 0) {
      this.warehouses = [...this.warehouses, ...newWarehouses];
      setTimeout(() => {
        const scrollableContainer = document.documentElement || document.body;
        scrollableContainer.scrollTop = scrollableContainer.scrollHeight;
      }, 0);
    } else {
      this.noMoreWarehouses = true;
      console.log("No more warehouse");
    }
    this.isLoading = false;
    if(this.page == 0)
      await this.spinner.hide();
    window.scrollTo(0, this.scrollPosition);
  }
  async applyFilter(filteredWarehouses: any): Promise<void> {
    this.warehouses = filteredWarehouses;
    this.page = 0;
    this.noMoreWarehouses = filteredWarehouses.length < this.pageSize;
  }

  async handleSuccess(): Promise<void> {
    this.warehouses = [];
    this.page = 0;
    this.noMoreWarehouses = false;
    await this.getWarehouses(this.page);
  }

  async onScroll(): Promise<void> {
    await this.getWarehouses(++this.page);
  }

  checkIfMobile(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  toggleSearch(): void {
    this.isSearchVisible = !this.isSearchVisible;
  }
  async ngOnInit(): Promise<void> {
    this.checkIfMobile();
    window.addEventListener('resize', this.checkIfMobile.bind(this));
    await this.getWarehouses(this.page);
  }
}
