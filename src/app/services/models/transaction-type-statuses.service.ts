import { Injectable } from '@angular/core';
import {HttpClientService} from "../http-client.service";
import {HttpErrorResponse} from "@angular/common/http";
import {ListTransactionTypeStatus} from "../../contracts/transaction-type-statuses/list-transaction-type-status";

@Injectable({
  providedIn: 'root'
})
export class TransactionTypeStatusesService {

  constructor(
    private httpClientService: HttpClientService
  ) { }

  async read(page: number, pageSize: number, successCallBack?: () => void, errorCallBack?: (errorMessage: string) => void): Promise<ListTransactionTypeStatus[]|undefined> {
    const promiseData: Promise<any> = this.httpClientService.get({
      controller: "transactiontypeStatuses",
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
