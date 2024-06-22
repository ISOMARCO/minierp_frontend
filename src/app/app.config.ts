import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import {provideRouter, RouterModule} from '@angular/router';

import { routes } from './app.routes';
import {BrowserModule, provideClientHydration} from '@angular/platform-browser';
import {HttpClientService} from "./services/http-client.service";
import {provideHttpClient, withFetch} from "@angular/common/http";

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    importProvidersFrom(
      BrowserModule,
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
            }
          ]
        },
        {
          path: "login",
          loadComponent: () => import('../app/ui/login/login.component').then(c => c.LoginComponent)
        }
      ])
    ),
    {provide: 'PHP_BASE_API_URL', useValue: 'http://localhost:8000/api', multi: true},
    {provide: 'BASE_API_URL', useValue: 'https://localhost:7070/api', multi: true},
    {provide: 'VERSION', useValue: 'v1', multi: true}
  ]
};
