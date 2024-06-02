import { Component } from '@angular/core';
import { Fornecedor } from '../models/fornecedor';

import { ActivatedRoute, RouterLink } from '@angular/router';
import { FornecedorService } from '../services/fornecedor.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ListaProdutosComponent } from "../produtos/lista-produtos.components";

@Component({
    selector: 'app-detalhes',
    templateUrl: './detalhes.component.html',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink, ListaProdutosComponent]
})
export class DetalhesComponent {

  fornecedor: Fornecedor = new Fornecedor();

  constructor(
    private route: ActivatedRoute,
    private fornecedorService: FornecedorService) {

      this.fornecedorService.obterPorId(this.route.snapshot.params['id'])
      .subscribe(fornecedor => this.fornecedor = fornecedor);
  }
}
