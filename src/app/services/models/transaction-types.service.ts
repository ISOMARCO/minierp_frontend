import { Injectable } from '@angular/core';
import {HttpClientService} from "../http-client.service";
import {ListTransactionTypes} from "../../contracts/transaction-types/list-transaction-types";
import {HttpErrorResponse} from "@angular/common/http";
import {ListTransactionTypeStatus} from "../../contracts/transaction-type-statuses/list-transaction-type-status";

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

  async statuses(): Promise<{ key: string, value: string }[] | undefined> {
    try {
      const promiseData: any = await this.httpClientService.get({
        controller: "transactionTypeStatuses"
      }).toPromise();

      if (promiseData) {
        return promiseData.map((item: any) => {
          return { value: item.id, text: item.name };
        });
      }
      return undefined;
    } catch (error) {
      console.error('Error fetching transaction type statuses', error);
      return undefined;
    }
  }

}
