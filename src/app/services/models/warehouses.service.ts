import { Injectable } from '@angular/core';
import {HttpClientService} from "../http-client.service";
import {HttpErrorResponse} from "@angular/common/http";
import {ListWarehouse} from "../../contracts/warehouses/list-warehouse";

@Injectable({
  providedIn: 'root'
})
export class WarehousesService {
  constructor(
    private readonly httpClientService: HttpClientService
  ) { }
  async read(page: number, pageSize: number, successCallBack?: () => void, errorCallBack?: (errorMessage: string) => void): Promise<ListWarehouse[]|undefined> {
    const promiseData: Promise<ListWarehouse[]|undefined> = this.httpClientService.get<ListWarehouse[]>({
      controller: "warehouses",
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
