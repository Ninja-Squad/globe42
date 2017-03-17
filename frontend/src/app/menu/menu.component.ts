import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'gl-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  navbarCollapsed = true;

  constructor() { }

  ngOnInit() {
  }

  toggleNavbar() {
    this.navbarCollapsed = !this.navbarCollapsed;
  }

}
