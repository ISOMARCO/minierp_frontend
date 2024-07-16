import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ModalDirective} from "../../directives/ui/modal.directive";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {NgxSpinnerComponent} from "ngx-spinner";

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [
    ModalDirective,
    ReactiveFormsModule,
    NgxSpinnerComponent
  ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  form: FormGroup;
  constructor() {
    this.form = new FormGroup('');
  }
  onSubmit(): void {}
  @Input('modal_id') modal_id: string = 'modal';
  @Input('data') data: any = [];
  @Input('size') size: string = 'xl';
  @Input('title') title!: string;
  @Input('show_save_button') show_save_button: boolean = true;
  @Input('model') model?: any;
  @Input('controller') controller?: string;
  @Input('method') method: string = "POST";
  @Input('ignore') ignore: string[] = [];
  @Input('formClass') formClass: string = "form";
  @Input('button_title') buttonTitle: string = "Save";
  @Output('successCallBack') successCallBack: EventEmitter<any> = new EventEmitter<any>();

  handleSuccess(): void {
    this.successCallBack.emit();
  }
}
