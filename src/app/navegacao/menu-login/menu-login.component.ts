import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LocalStorageUtils } from '../../utils/localstorage';
import { CommonModule } from '@angular/common';
//import { LocalStorageUtils } from 'src/app/utils/localstorage';

@Component({
  selector: 'app-menu-login',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './menu-login.component.html',
})
export class MenuLoginComponent {

  token: string = "";
  user: any;
  email: string = "";
  localStorageUtils = new LocalStorageUtils();

  constructor(private router: Router) {  }

  usuarioLogado(): boolean {
    this.token = this.localStorageUtils.obterTokenUsuario();
    this.user = this.localStorageUtils.obterUsuario();

    if (this.user)
      this.email = this.user.email;

    return this.token !== null;
  }

  logout() {
    this.localStorageUtils.limparDadosLocaisUsuario();
    this.router.navigate(['/home']);
  }
}
