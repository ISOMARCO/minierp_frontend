import { Injectable } from '@angular/core';
declare var alertify: any;
@Injectable({
  providedIn: 'root'
})
export class AlertifyService
{
  constructor() { }
  message(message: string, options?: Partial<AlertifyOptions>) : void
  {
    options = options || new AlertifyOptions();
    if(options.messageType === undefined)
    {
      throw new Error('messageType is required');
    }
    alertify.set('notifier', 'position', options.position);
    alertify.set('notifier', 'delay', options.delay);
    const msg = alertify[options.messageType](message);
    if(options.dismissOthers)
    {
      msg.dismissOthers();
    }
  }

  confirm(title: string, message: string, okeyCallBack?: ()=> void, cancelCallBack?: () => void): void {
    alertify.confirm(title, message);
    if(okeyCallBack)
      alertify.confirm().set('onok', okeyCallBack);
    if(cancelCallBack)
      alertify.confirm().set('oncancel', cancelCallBack);
  }
}

export class AlertifyOptions
{
  messageType: MessageType = MessageType.Message;
  position: Position = Position.BottomRight;
  delay: number = 3;
  dismissOthers: boolean = false;

  constructor(messageType: MessageType = MessageType.Message, position: Position = Position.BottomRight, delay: number = 3, dismissOthers: boolean = false)
  {
    this.messageType = messageType;
    this.position = position;
    this.delay = delay;
    this.dismissOthers = dismissOthers;
  }
}

export enum MessageType
{
  Error = 'error',
  Message = 'message',
  Succcess = 'success',
  Warning = 'warning',
  Notify = 'notify'
}

export enum Position
{
  TopCenter = 'top-center',
  TopLeft = 'top-left',
  TopRight = 'top-right',
  BottomCenter = 'bottom-center',
  BottomLeft = 'bottom-left',
  BottomRight = 'bottom-right',
  Center = 'center'
}
