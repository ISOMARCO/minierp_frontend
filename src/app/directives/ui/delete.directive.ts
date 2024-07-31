import {Directive, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2} from '@angular/core';
import {HttpClientService} from "../../services/http-client.service";
import {AlertifyService, MessageType, Position} from "../../services/alertify.service";
import {HttpErrorResponse} from "@angular/common/http";

@Directive({
  selector: '[appDelete]',
  standalone: true
})
export class DeleteDirective implements OnInit{
  constructor(
    private readonly httpClientService: HttpClientService,
    private readonly renderer: Renderer2,
    private readonly element: ElementRef,
    private readonly alertify: AlertifyService
  ) {}
  ngOnInit(): void {
    if(this.createButton) {
      const button: HTMLElement = document.createElement('button');
      const icon: HTMLElement = document.createElement('i');
      icon.setAttribute('class', 'fas fa-trash');
      button.setAttribute('class', 'btn btn-outline-danger');
      this.renderer.appendChild(this.element.nativeElement, button);
      this.renderer.appendChild(button, icon);
      button.setAttribute('style', this.style);
      this.renderer.listen(button, 'click', this.onClick.bind(this));
    } else {
      this.renderer.listen(this.element.nativeElement, 'click', this.onClick.bind(this));
    }
  }

  @Input('style') style: string = 'float: right;';
  @Input('controller') controller!: string;
  //@Input('id') id!: string;
  @Input('body') body!: any;
  @Input('title') title: string = 'Silmək istədiyinizdən əminsiniz?';
  @Input('createButton') createButton?: boolean = true;
  @Input('message') message: string = 'Silmək istədiyinizdən əminsiniz?';
  @Output('successCallBack') successCallBack: EventEmitter<any> = new EventEmitter<any>();
  onClick(): void {
    this.alertify.confirm(this.title, this.message, () => {
      this.httpClientService.delete({
        controller: this.controller
      }, this.body).subscribe(data => {
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
