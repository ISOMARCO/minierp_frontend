import { Injectable } from '@angular/core';
import {HttpClientService} from "../http-client.service";
import {HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {ListProduct} from "../../contracts/products/list-product";

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(
    private readonly httpClientService: HttpClientService
  ) { }

  async read(page: number, pageSize: number, successCallBack?: () => void, errorCallBack?: (errorMessage: string) => void): Promise<ListProduct[]|undefined> {
    const promiseData: Promise<ListProduct[]|undefined> = this.httpClientService.get<ListProduct[]>({
      controller: "products",
      queryString: `page=${page}&size=${pageSize}`,
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
