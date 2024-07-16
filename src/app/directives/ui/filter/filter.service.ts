import {Injectable, OnInit} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilterService implements OnInit{
  public isMobile: boolean = false;
  public isSearchVisible: boolean = false;
  public showFilter: {"d-none" : boolean} = {'d-none' : false};
  public col12: boolean = this.isMobile && !this.isSearchVisible;

  checkIfMobile() {
    this.isMobile = window.innerWidth <= 768;
  }

  toggleSearch() {
    this.isSearchVisible = !this.isSearchVisible;
    this.showFilter = {'d-none' : this.isMobile && !this.isSearchVisible};
  }

  async ngOnInit(): Promise<void> {
    this.checkIfMobile();
    window.addEventListener('resize', this.checkIfMobile.bind(this));
    this.showFilter = {'d-none' : this.isMobile && !this.isSearchVisible};
  }
}

