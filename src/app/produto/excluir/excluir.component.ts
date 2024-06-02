import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProdutoService } from '../services/produto.service';

import { ToastrService } from 'ngx-toastr';

import { Produto } from '../models/produto';
import { environment } from '../../../environments/environment'; 

@Component({
  selector: 'app-excluir',
  templateUrl: './excluir.component.html'
})
export class ExcluirComponent implements OnInit {

  imagens: string = environment.imagensUrl;
  produto!: Produto;

  constructor(private produtoService: ProdutoService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService) {
  }

  ngOnInit(): void{
    const id = this.route.snapshot.params['id'];
    this.produtoService.obterPorId(id).subscribe(produto => this.produto = produto);
  }

  public excluirProduto() {
    this.produtoService.excluirProduto(this.produto.id)
      .subscribe(
      evento => { this.sucessoExclusao(evento) },
      ()     => { this.falha() }
      );
  }

  public sucessoExclusao(evento: any) {

    const toast = this.toastr.success('Produto excluido com Sucesso!', 'Good bye :D');
    if (toast) {
      toast.onHidden.subscribe(() => {
        this.router.navigate(['/produtos/listar-todos']);
      });
    }
  }

  public falha() {
    this.toastr.error('Houve um erro no processamento!', 'Ops! :(');
  }
}

