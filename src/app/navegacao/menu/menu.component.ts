import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from "../../conta/login/login.component";
import { MenuLoginComponent } from "../menu-login/menu-login.component";


@Component({
    selector: 'app-menu',
    standalone: true,
    templateUrl: './menu.component.html',
    imports: [RouterModule, CommonModule, NgbCollapse, LoginComponent, MenuLoginComponent]
})
export class MenuComponent {

  public isCollapsed: boolean;

  constructor() {
    this.isCollapsed = true;
  }
}
