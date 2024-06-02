import { Component, Input } from '@angular/core';
import { Produto } from '../../produto/models/produto'; 
import { environment } from '../../../environments/environment'; 
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lista-produto',
  templateUrl: './lista-produtos.component.html',
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class ListaProdutosComponent {

  imagens: string = environment.imagensUrl;

  @Input()
  produtos!: Produto[];
}