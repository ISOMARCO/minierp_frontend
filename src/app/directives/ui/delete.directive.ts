import {Directive, ElementRef, EventEmitter, Input, Output, Renderer2} from '@angular/core';
import {HttpClientService} from "../../services/http-client.service";
import {AlertifyService, MessageType, Position} from "../../services/alertify.service";
import {HttpErrorResponse} from "@angular/common/http";

@Directive({
  selector: '[appDelete]',
  standalone: true
})
export class DeleteDirective {
  constructor(
    private httpClientService: HttpClientService,
    private renderer: Renderer2,
    private element: ElementRef,
    private alertify: AlertifyService
  ) {
    const button: HTMLElement = document.createElement('button');
    const icon: HTMLElement = document.createElement('i');
    icon.setAttribute('class', 'fas fa-trash');
    button.setAttribute('class', 'btn btn-outline-danger');
    renderer.appendChild(element.nativeElement, button);
    renderer.appendChild(button, icon);
    button.setAttribute('style', this.style);
    this.renderer.listen(button, 'click', this.onClick.bind(this));
  }
  @Input('style') style: string = 'float: right;';
  @Input('controller') controller!: string;
  @Input('id') id!: string;
  @Input('title') title: string = 'Silmək istədiyinizdən əminsiniz?';
  @Input('message') message: string = 'Silmək istədiyinizdən əminsiniz?';
  @Output('successCallBack') successCallBack: EventEmitter<any> = new EventEmitter<any>();
  onClick(): void {
    this.alertify.confirm(this.title, this.message, () => {
      this.httpClientService.delete({
        controller: this.controller
      }, this.id).subscribe(data => {
        this.alertify.message('Deleted successfully', {
          dismissOthers: true,
          messageType: MessageType.Succcess,
          position: Position.BottomRight
        });
        this.successCallBack.emit();
      }, (error: HttpErrorResponse) => {
        console.error(error.message);
      });
    });
  }

}
