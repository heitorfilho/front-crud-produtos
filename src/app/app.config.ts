import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { ContaService } from './conta/services/conta.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { ContaGuard } from './conta/services/conta.guard';
import { provideToastr } from 'ngx-toastr';
import { FornecedorService } from './fornecedor/services/fornecedor.service';
import { FornecedorResolve } from './fornecedor/services/fornecedor.resolve';
import { FornececedorGuard } from './fornecedor/services/fornecedor.guard';
import { ProdutoModule } from './produto/produto.module';

export const appConfig: ApplicationConfig = {


  providers: [provideRouter(routes),
    importProvidersFrom(HttpClientModule, ProdutoModule),
    //provideAnimations(),
    provideToastr(),
    provideAnimations(),
    //ToastrModule,
    ContaService,
    FornecedorService,
    FornecedorResolve,
    FornececedorGuard,
    ContaGuard,
    HttpClient,
    ToastrService,
    BrowserModule
  ]
};
