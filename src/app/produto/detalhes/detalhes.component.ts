import { Component, OnInit } from '@angular/core';
import { Produto } from '../models/produto';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { ProdutoService } from '../services/produto.service';

@Component({
  selector: 'app-detalhes',
  templateUrl: './detalhes.component.html',
})
export class DetalhesComponent implements OnInit{

  imagens: string = environment.imagensUrl;
  produto!: Produto;

  constructor(
      private route: ActivatedRoute,
      private produtoService: ProdutoService) {
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.produtoService.obterPorId(id).subscribe(produto => this.produto = produto);
  }
}
