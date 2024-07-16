import {Directive, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {HttpClientService} from "../../services/http-client.service";
import {HttpErrorResponse} from "@angular/common/http";
import {NgxSpinnerService} from "ngx-spinner";
declare var $: any;
@Directive({
  selector: '[appModal]',
  standalone: true
})
export class ModalDirective implements OnInit{
  constructor(
    private readonly renderer: Renderer2,
    private readonly elementRef: ElementRef,
    private readonly httpClientService: HttpClientService,
    private readonly spinner: NgxSpinnerService
  ) {}
  form: FormGroup = new FormGroup({});
  ngOnInit(): void {
    const modalDialog: HTMLElement = this.renderer.createElement('div');
    modalDialog.setAttribute('class', 'modal-dialog modal-'+this.size);
    const modalContent: HTMLElement = this.renderer.createElement('div');
    modalContent.setAttribute('class', 'modal-content');
    this.renderer.appendChild(this.elementRef.nativeElement, modalDialog);
    this.renderer.appendChild(modalDialog, modalContent);
    const modalHeader: HTMLElement = this.renderer.createElement('div');
    modalHeader.setAttribute('class', 'modal-header');
    const modalBody: HTMLElement = this.renderer.createElement('div');
    modalBody.setAttribute('class', 'modal-body');
    this.renderer.appendChild(modalContent, modalHeader);
    this.renderer.appendChild(modalContent, modalBody);
    const modalTitle: HTMLElement = this.renderer.createElement('h4');
    modalTitle.innerHTML = this.title;
    this.renderer.appendChild(modalHeader, modalTitle);
    const closeButton: HTMLElement = this.renderer.createElement('button');
    closeButton.setAttribute('class', 'close');
    closeButton.setAttribute('data-dismiss', 'modal');
    closeButton.innerHTML = '<span aria-hidden="true">&times;</span>';
    closeButton.setAttribute('type', 'button');
    closeButton.setAttribute('aria-label', 'Close');
    this.renderer.appendChild(modalHeader, closeButton);
    const row: HTMLElement = this.renderer.createElement('div');
    row.setAttribute('class', 'row');
    this.renderer.appendChild(modalBody, row);
    for(const item of this.data) {
      item.element_type = item.element_type || 'input';
      item.col_size  = item.col_size || 12;
      item.type = item.type || 'text';
      item.icon = item.icon || 'fas fa-user';
      if(item.type !== 'hidden') {
        let col: HTMLElement = this.renderer.createElement('div');
        col.setAttribute('class', 'col-12 col-md-'+item.col_size);
        this.renderer.appendChild(row, col);
        let inputGroup: HTMLElement = this.renderer.createElement('div');
        inputGroup.setAttribute('class', 'input-group mb-3');
        this.renderer.appendChild(col, inputGroup);
        let input: HTMLElement = this.renderer.createElement(item.element_type);
        input.setAttribute('type', item.type);
        input.setAttribute('class', 'form-control');
        input.setAttribute('formControlName', item.name);
        input.setAttribute('name', item.name);
        if(item.element_type === 'select' && item.options) {
          for(const option of item.options) {
            let optionElement: HTMLElement = this.renderer.createElement('option');
            optionElement.setAttribute('value', option.value);
            optionElement.innerHTML = option.text;
            this.renderer.appendChild(input, optionElement);
          }
          input.removeAttribute('type');
        }
        if(item.value) {
          if(item.element_type === 'textarea')
            input.innerHTML = item.value;
          else
            input.setAttribute('value', item.value);
        }
        if(!this.show_save_button)
          input.setAttribute('disabled', 'disabled');
        if(item.readonly)
          input.setAttribute('readonly', 'readonly');
        input.setAttribute('placeholder', item.placeholder || '');
        this.renderer.appendChild(inputGroup, input);
        let inputGroupAppend: HTMLElement = this.renderer.createElement('div');
        inputGroupAppend.setAttribute('class', 'input-group-append');
        this.renderer.appendChild(inputGroup, inputGroupAppend);
        let span: HTMLElement = this.renderer.createElement('span');
        span.setAttribute('class', 'input-group-text');
        span.innerHTML = '<i class="'+item.icon+'"></i>';
        this.renderer.appendChild(inputGroupAppend, span);
      }
      else {
        let input: HTMLElement = this.renderer.createElement(item.element_type);
        input.setAttribute('type', item.type);
        input.setAttribute('formControlName', item.name);
        input.setAttribute('name', item.name);
        input.setAttribute('value', item.value || '');
        this.renderer.appendChild(row, input);
      }
      this.form.addControl(item.name, new FormGroup(''));
    }
    if(this.show_save_button) {
      const modalFooter: HTMLElement = this.renderer.createElement('div');
      modalFooter.setAttribute('class', 'modal-footer justify-content-between');
      this.renderer.appendChild(modalContent, modalFooter);
      const closeButton: HTMLElement = this.renderer.createElement('button');
      closeButton.setAttribute('class', 'btn btn-default');
      closeButton.setAttribute('data-dismiss', 'modal');
      closeButton.innerHTML = 'Close';
      this.renderer.appendChild(modalFooter, closeButton);
      const saveButton: HTMLElement = this.renderer.createElement('button');
      saveButton.setAttribute('class', 'btn btn-primary');
      saveButton.innerHTML = this.buttonTitle;
      this.renderer.appendChild(modalFooter, saveButton);
      if(this.show_save_button) {
        this.renderer.listen(saveButton, 'click', () => {
          const datas: {name: string, value: string}[] = $("."+this.formClass).serializeArray();
          for(const val of datas) {
            if(!this.ignore.includes(val.name)) {
              this.model[val.name] = val.value;
            }
          }
          switch(this.method.toLowerCase()) {
            case "post":
              this.spinner.show();
              this.httpClientService.post({
                controller: this.controller
              }, this.model).subscribe(result => {
                console.log(result);
                this.successCallBack.emit(result);
                $('.'+this.formClass)[0].reset();
                $("#"+this.modal_id).modal('hide');
                this.spinner.hide();
              }, (httpErrorResponse: HttpErrorResponse) => {
                console.error(httpErrorResponse.error);
                this.spinner.hide();
              });
              break;

            case "put":
              this.spinner.show();
              this.httpClientService.put({
                controller: this.controller
              }, this.model).subscribe(result => {
                console.log(result);
                this.successCallBack.emit(result);
                $('.'+this.formClass)[0].reset();
                $("#"+this.modal_id).modal('hide');
                this.spinner.hide();
              }, (httpErrorResponse: HttpErrorResponse) => {
                console.error(httpErrorResponse.error);
                this.spinner.hide();
              });
              break;
            default:
              console.error("Method not supported");
              break;
          }
        });
      }
    }
  }

  @Input('data') data: {
    element_type?: string,
    col_size?: number,
    type?: string,
    placeholder?: string,
    readonly?: string;
    icon?: string,
    value?: string,
    name: string;
    options?: {value: string, text: string}[];
  }[] = [];
  @Input('modal_id') modal_id?: string;
  @Input('title') title!: string;
  @Input('size') size: string = 'xl';
  @Input('show_save_button') show_save_button: boolean = true;
  @Input('model') model: any;
  @Input('ignore') ignore: string[] = [];
  @Input('controller') controller?: string;
  @Input('method') method: string = "POST";
  @Input('formClass') formClass: string = "form";
  @Input('button_title') buttonTitle: string = "Save";
  @Output('successCallBack') successCallBack: EventEmitter<any> = new EventEmitter<any>();
}
