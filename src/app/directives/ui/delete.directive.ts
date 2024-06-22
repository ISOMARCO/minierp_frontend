import {Directive, ElementRef, HostListener, Input, Renderer2} from '@angular/core';
import {HttpClientService} from "../../services/http-client.service";
import {AlertifyService} from "../../services/alertify.service";
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
  }
  @Input('style') style: string = 'float: right;';
  @Input('controller') controller!: string;
  @Input('id') id!: string;
  @HostListener('click')
  onClick(): void {
    this.alertify.confirm('are you sure ?', 'Are you sure', () => {
      this.httpClientService.delete({
        controller: this.controller
      }, this.id).subscribe(() => {
        this.alertify.message('Deleted successfully');
      });
    });
  }

}
