import {Directive, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2} from '@angular/core';
import {NgxSpinnerService} from "ngx-spinner";
import {HttpClientService} from "../../../services/http-client.service";
import {HttpErrorResponse} from "@angular/common/http";
declare var $: any;
@Directive({
  selector: '[appFilter]',
  standalone: true
})
export class FilterDirective implements OnInit{

  constructor(
    private readonly renderer: Renderer2,
    private readonly elementRef: ElementRef,
    private readonly spinner: NgxSpinnerService,
    private readonly httpClientService: HttpClientService
  ) { }

  private toQueryString(obj: any): string {
    return  Object.keys(obj)
      .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]))
      .join('&');
  }

  ngOnInit(): void {
    const filterBody = this.renderer.createElement('div');
    filterBody.setAttribute('class', 'card collapsed-card');
    this.renderer.appendChild(this.elementRef.nativeElement, filterBody);
    const cardHeader = this.renderer.createElement('div');
    cardHeader.setAttribute('class', 'card-header');
    cardHeader.innerHTML = '<span style="font-weight: bold;">Filter</span>';
    this.renderer.appendChild(filterBody, cardHeader);
    const cardTools = this.renderer.createElement('div');
    cardTools.setAttribute('class', 'card-tools');
    this.renderer.appendChild(cardHeader, cardTools);
    const button = this.renderer.createElement('button');
    button.setAttribute('class', 'btn btn-tool');
    button.innerHTML = '<i class="fas fa-plus"></i>';
    button.setAttribute('type', 'button');
    button.setAttribute('data-card-widget', 'collapse');
    this.renderer.appendChild(cardTools, button);
    const cardBody = this.renderer.createElement('div');
    cardBody.setAttribute('class', 'card-body');
    this.renderer.appendChild(filterBody, cardBody);
    for(const item of this.data) {
      item.element_type = item.element_type || 'input';
      item.type = item.type || 'text';
      const formGroup = this.renderer.createElement('div');
      formGroup.setAttribute('class', 'form-group');
      this.renderer.appendChild(cardBody, formGroup);
      const label = this.renderer.createElement('label');
      label.innerHTML = item.label;
      label.setAttribute('for', item.name);
      this.renderer.appendChild(formGroup, label);
      if(item.element_type === 'select') {
        const select = this.renderer.createElement('select');
        select.setAttribute('class', 'form-control');
        select.setAttribute('formControlName', item.name);
        select.setAttribute('id', item.name);
        this.renderer.appendChild(formGroup, select);
        for(const option of item.options || []) {
          const optionElement = this.renderer.createElement('option');
          optionElement.setAttribute('value', option.value);
          optionElement.innerHTML = option.text;
          this.renderer.appendChild(select, optionElement);
        }
      } else {
        const input = this.renderer.createElement(item.element_type);
        input.setAttribute('type', item.type);
        input.setAttribute('class', 'form-control');
        input.setAttribute('formControlName', item.name);
        input.setAttribute('name', item.name);
        input.setAttribute('id', item.name);
        this.renderer.appendChild(formGroup, input);
      }
    }
    const searchButton = this.renderer.createElement('button');
    searchButton.setAttribute('class', 'btn btn-secondary btn-block btn-sm');
    searchButton.innerHTML = 'Search <i class="fas fa-search"></i>';
    searchButton.setAttribute('type', 'button');
    this.renderer.appendChild(cardBody, searchButton);
    const clearFilterButton = this.renderer.createElement('button');
    clearFilterButton.setAttribute('class', 'btn btn-danger btn-block btn-sm mt-2');
    clearFilterButton.innerHTML = 'Clear Filter <i class="fas fa-times"></i>';
    clearFilterButton.setAttribute('type', 'button');
    this.renderer.appendChild(cardBody, clearFilterButton);
    this.renderer.listen(clearFilterButton, 'click', () => {
      $('.'+this.formClass)[0].reset();
      this.clearFilter.emit();
    });
    this.renderer.listen(searchButton, 'click', () => {
      this.spinner.show();
      const datas: {name: string, value: string}[] = $("."+this.formClass).serializeArray();
      for(const val of datas) {
        this.model[val.name] = val.value.toLowerCase();
      }
      this.httpClientService.get({
        controller: this.controller,
        action: 'filter',
        queryString: this.toQueryString(this.model)
      }).subscribe((response: any) => {
        console.log(response);
        this.successCallBack.emit(response);
        this.spinner.hide();
      }, (httpErrorResponse: HttpErrorResponse) => {
        console.error(httpErrorResponse.message);
      });
    });
  }
  @Input('data') data: {
    element_type?: string,
    type?: string,
    placeholder?: string,
    value?: string,
    label?: string,
    name: string;
    options?: {value: string, text: string}[];
  }[] = [];
  @Input('model') model: any;
  @Input('formClass') formClass: string = 'filter-form';
  @Input('controller') controller!: string;
  @Output('successCallBack') successCallBack: EventEmitter<any> = new EventEmitter<any>();
  @Output('clearFilter') clearFilter: EventEmitter<any> = new EventEmitter<any>();
}
