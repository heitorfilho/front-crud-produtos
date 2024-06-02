import { Routes } from '@angular/router';
import { HomeComponent } from './navegacao/home/home.component';
import { ContaAppComponent } from './conta/conta.app.component';
import { CadastroComponent } from './conta/cadastro/cadastro.component';
import { LoginComponent } from './conta/login/login.component';
import { NotFoundComponent } from './navegacao/not-found/not-found.component';
import { ContaGuard } from './conta/services/conta.guard';
import { FornecedorAppComponent } from './fornecedor/fornecedor.app.component';
import { ListaComponent } from './fornecedor/lista/lista.component';
import { NovoComponent } from './fornecedor/novo/novo.component';
import { EditarComponent } from './fornecedor/editar/editar.component';
import { DetalhesComponent } from './fornecedor/detalhes/detalhes.component';
import { ExcluirComponent } from './fornecedor/excluir/excluir.component';
import { FornecedorResolve } from './fornecedor/services/fornecedor.resolve';
import { FornececedorGuard } from './fornecedor/services/fornecedor.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'conta',
        children: [
            { path: '', component: ContaAppComponent },
            { path: 'cadastro', component: CadastroComponent, canDeactivate: [ContaGuard] },
            { path: 'login', component: LoginComponent, canActivate: [ContaGuard] }
        ]
    },
    { path: 'fornecedores',
        children: [
            { path: '', component: FornecedorAppComponent },
            { path: 'listar-todos', component: ListaComponent },
            { path: 'adicionar-novo', component: NovoComponent },
            { 
                path: 'editar/:id', component: EditarComponent,
                resolve: {
                    fornecedor: FornecedorResolve
                },
                canDeactivate: [FornececedorGuard],
                canActivate: [FornececedorGuard],
                data: [{ claim: { nome: 'Fornecedor', valor: 'Adicionar'}}]
            },
            { path: 'detalhes/:id', component: DetalhesComponent },
            { path: 'excluir/:id', component: ExcluirComponent }
        ]
    },
    // carrega ProdutoModule com seu arquivo de rotas
    {
        path: 'produtos',
        loadChildren: () => import('./produto/produto.module')
          .then(m => m.ProdutoModule)
    },
    // { path: 'conta/cadastro', component: CadastroComponent },
    // { path: 'conta/login', component: LoginComponent },
    { path: '**', component: NotFoundComponent }
];
