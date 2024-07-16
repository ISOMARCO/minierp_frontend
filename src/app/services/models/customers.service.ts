import { Injectable } from '@angular/core';
import {HttpClientService} from "../http-client.service";
import {ListCustomer} from "../../contracts/customers/list-customer";
import {HttpErrorResponse} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  constructor(
    private httpClientService: HttpClientService
  ) { }

  async read(page: number, pageSize: number, successCallBack?: () => void, errorCallBack?: (errorMessage: string) => void): Promise<ListCustomer[]|undefined> {
    const promiseData = this.httpClientService.get<ListCustomer[]>({
      controller: "customers",
      queryString: `page=${page}&size=${pageSize}`
    }).toPromise();
    if(promiseData) {
      promiseData.then(data => {
        if(successCallBack)
          successCallBack();
      }).catch((errorResponse: HttpErrorResponse) => {
        if(errorCallBack)
          errorCallBack(errorResponse.message);
      });
      return await promiseData;
    }
    return undefined;
  }
}
