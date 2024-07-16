import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import {provideRouter, RouterModule} from '@angular/router';

import { routes } from './app.routes';
import {BrowserModule, provideClientHydration} from '@angular/platform-browser';
import {HttpClientService} from "./services/http-client.service";
import {provideHttpClient, withFetch} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    importProvidersFrom(
      BrowserModule,
      BrowserAnimationsModule,
      HttpClientService,
      RouterModule.forRoot([
        {
          path: "",
          loadComponent: () => import('../app/ui/layouts/layouts.component').then(c => c.LayoutsComponent),
          children: [
            {
              path: "",
              loadComponent: () => import('../app/ui/home/home.component').then(c => c.HomeComponent)
            },
            {
              path: "users",
              loadComponent: () => import('../app/ui/users/users.component').then(c => c.UsersComponent)
            },
            {
              path: "customers",
              loadComponent: () => import('../app/ui/customers/customers.component').then(c => c.CustomersComponent)
            },
            {
              path: "products",
              loadComponent: () => import('./ui/products/products.component').then(c => c.ProductsComponent)
            },
            {
              path: "transaction-types",
              loadComponent: () => import('../app/ui/transaction-types/transaction-types.component').then(c => c.TransactionTypesComponent)
            }
          ]
        },
        {
          path: "login",
          loadComponent: () => import('../app/ui/login/login.component').then(c => c.LoginComponent)
        }
      ])
    ),
    {provide: 'BASE_API_URL', useValue: 'http://192.168.0.120:5003/api', multi: true},
    {provide: 'VERSION', useValue: 'v1', multi: true}
  ]
};
