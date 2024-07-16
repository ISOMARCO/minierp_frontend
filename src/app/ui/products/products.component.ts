import {Component, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {FilterDirective} from "../../directives/ui/filter/filter.directive";
import {FilterProduct} from "../../contracts/products/filter-product";
import {DeleteDirective} from "../../directives/ui/delete.directive";
import {InfiniteScrollDirective} from "ngx-infinite-scroll";
import {ModalComponent} from "../../components/modal/modal.component";
import {NgxSpinnerComponent, NgxSpinnerService} from "ngx-spinner";
import {EditProduct} from "../../contracts/products/edit-product";
import {ProductsService} from "../../services/models/products.service";
import {ListProduct} from "../../contracts/products/list-product";
import {CreateProduct} from "../../contracts/products/create-product";

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    RouterLink,
    NgClass,
    FilterDirective,
    ReactiveFormsModule,
    DeleteDirective,
    InfiniteScrollDirective,
    ModalComponent,
    NgForOf,
    NgIf,
    NgxSpinnerComponent
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit{
  form: FormGroup;
  products: any = [];
  filterProduct: FilterProduct = new FilterProduct();
  createProduct: CreateProduct = new CreateProduct();
  editProduct: EditProduct = new EditProduct();
  private scrollPosition: number = 0;
  private page: number = 0;
  private pageSize: number = 10;
  private isLoading: boolean = false;
  private noMoreProducts: boolean = false;
  public isMobile: boolean = false;
  public isSearchVisible: boolean = false;
  constructor(
    private productService: ProductsService,
    private spinner: NgxSpinnerService
  ) {
    this.form = new FormGroup('');
  }

  async getProducts(page: number): Promise<void> {
    if (this.isLoading || this.noMoreProducts) {
      return;
    }
    this.isLoading = true;
    if(this.page == 0)
      await this.spinner.show();
    const newProducts: ListProduct[]|undefined =  await this.productService.read(page, this.pageSize, (): void => {
      console.log("Success");
    }, (errorMessage: string): void =>{
      console.error(errorMessage);
    });
    if (newProducts && newProducts.length > 0) {
      this.products = [...this.products, ...newProducts];
      setTimeout(() => {
        const scrollableContainer = document.documentElement || document.body;
        scrollableContainer.scrollTop = scrollableContainer.scrollHeight;
      }, 0);
    } else {
      this.noMoreProducts = true;
      console.log("No more product");
    }
    this.isLoading = false;
    if(this.page == 0)
      await this.spinner.hide();
    window.scrollTo(0, this.scrollPosition);
  }

  async applyFilter(filteredProducts: any): Promise<void> {
    this.products = filteredProducts;
    this.page = 0;
    this.noMoreProducts = filteredProducts.length < this.pageSize;
  }

  async handleSuccess(): Promise<void> {
    this.products = [];
    this.page = 0;
    this.noMoreProducts = false;
    await this.getProducts(this.page);
  }

  async onScroll(): Promise<void> {
    await this.getProducts(++this.page);
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
    await this.getProducts(this.page);
  }
}
