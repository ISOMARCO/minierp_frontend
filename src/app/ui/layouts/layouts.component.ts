import { Component } from '@angular/core';
import {RouterModule, RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-layouts',
  standalone: true,
  imports: [RouterModule, RouterOutlet],
  templateUrl: './layouts.component.html',
  styleUrl: './layouts.component.scss'
})
export class LayoutsComponent {

}
