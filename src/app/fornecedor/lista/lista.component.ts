import { Component, OnInit } from '@angular/core';
import { FornecedorService } from '../services/fornecedor.service';
import { Fornecedor } from '../models/fornecedor';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class ListaComponent implements OnInit {

  public fornecedores!: Fornecedor[];
  errorMessage!: string;

  constructor(private fornecedorService: FornecedorService) { }

  ngOnInit(): void {
    this.fornecedorService.obterTodos()
      .subscribe(
        fornecedores => this.fornecedores = fornecedores,
        error => this.errorMessage);
  }
}
