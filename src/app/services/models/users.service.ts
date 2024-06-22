import { Injectable } from '@angular/core';
import {HttpClientService} from "../http-client.service";
import {HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {ListUser} from "../../contracts/list-user";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private httpClientService: HttpClientService
  ) { }

  async read(successCallBack?: () => void, errorCallBack?: (errorMessage: string) => void): Promise<ListUser[]|undefined> {
    const promiseData: Promise<ListUser[]|undefined> = this.httpClientService.get<ListUser[]>({
      controller: "users",
      headers: new HttpHeaders().set('Accept', 'application/json').set('Authorization', 'Bearer 1|HRom7tqmc8kvylrWkjx1necpMsTQW5FHKH8bsndEcd14f9ed')
    }).toPromise();
    if(promiseData) {
      promiseData.then(data => {
        if(successCallBack)
          successCallBack();
      }).catch((errorResponse: HttpErrorResponse): void => {
        if(errorCallBack)
          errorCallBack(errorResponse.message);
      });
      return await promiseData;
    }
    return undefined;
  }
}
