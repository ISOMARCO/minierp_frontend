import { Injectable } from '@angular/core';
import {HttpClientService} from "../http-client.service";
import {ListTransactionTypes} from "../../contracts/transaction-types/list-transaction-types";
import {HttpErrorResponse} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class TransactionTypesService {

  constructor(
    private readonly httpClientService: HttpClientService
  ) { }

  async read(page: number, pageSize: number, successCallBack?: () => void, errorCallBack?: (errorMessage: string) => void): Promise<ListTransactionTypes[]|undefined> {
    const promiseData: Promise<any> = this.httpClientService.get({
      controller: "transactiontypes",
      queryString: `page=${page}&size=${pageSize}`
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
