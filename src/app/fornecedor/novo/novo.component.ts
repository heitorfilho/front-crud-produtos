import { Component, OnInit, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControlName, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { Observable, fromEvent, merge } from 'rxjs';

import { ToastrService } from 'ngx-toastr';

import { Fornecedor } from '../models/fornecedor';
import { FornecedorService } from '../services/fornecedor.service';
import { CommonModule } from '@angular/common';
import { DisplayMessage, GenericValidator, ValidationMessages } from '../../utils/generic-form-validation';
import { CepConsulta } from '../models/endereco';
import { CurrencyUtils } from '../../utils/currency-utils';

@Component({
  selector: 'app-novo',
  templateUrl: './novo.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink]
})
export class NovoComponent implements OnInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements!: ElementRef[];

  errors: any[] = [];
  fornecedorForm!: FormGroup;
  fornecedor: Fornecedor = new Fornecedor();

  validationMessages: ValidationMessages;
  genericValidator: GenericValidator;
  displayMessage: DisplayMessage = {};
  textoDocumento: string = 'CPF (requerido)'

  formResult: string = '';

  mudancasNaoSalvas!: boolean;
e: any;

  constructor(private fb: FormBuilder,
    private fornecedorService: FornecedorService,
    private router: Router,
    private toastr: ToastrService) {

    this.validationMessages = {
      nome: {
        required: 'Informe o Nome',
      },
      documento: {
        required: 'Informe o Documento',
      },
      logradouro: {
        required: 'Informe o Logradouro',
      },
      numero: {
        required: 'Informe o Número',
      },
      bairro: {
        required: 'Informe o Bairro',
      },
      cep: {
        required: 'Informe o CEP'
      },
      cidade: {
        required: 'Informe a Cidade',
      },
      estado: {
        required: 'Informe o Estado',
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit() {

    this.fornecedorForm = this.fb.group({
      nome: ['', [Validators.required]],
      documento: ['', [Validators.required]],
      ativo: ['', [Validators.required]],
      tipoFornecedor: ['', [Validators.required]],

      endereco: this.fb.group({
        logradouro: ['', [Validators.required]],
        numero: ['', [Validators.required]],
        complemento: [''],
        bairro: ['', [Validators.required]],
        cep: ['', [Validators.required]],
        cidade: ['', [Validators.required]],
        estado: ['', [Validators.required]]
      })
    });

    this.fornecedorForm.patchValue({ tipoFornecedor: '1', ativo: true })
  }

  ngAfterViewInit(): void {

    this.tipoFornecedorForm().valueChanges
      .subscribe(() => {
        this.trocarValidacaoDocumento();
        this.configurarElementosValidacao();
        this.validarFormulario();
      });

    this.configurarElementosValidacao();
    // event click -> clicar no tipo -> verifica tipo e altera 
  }

  configurarElementosValidacao(){
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    merge(...controlBlurs).subscribe(() => {
      this.validarFormulario();
    });
  }

  validarFormulario(){
    this.displayMessage = this.genericValidator.processarMensagens(this.fornecedorForm);
    this.mudancasNaoSalvas = true;
  }

  trocarValidacaoDocumento(){
    if (this.tipoFornecedorForm().value === "1") {
      this.documento().clearValidators();
      // setValidators(mascara)
      // this.documento().setValidators();
      this.textoDocumento = "CPF (requerido)"
    } else{
      this.documento().clearValidators();
      // setValidators(mascara)
      // this.documento().setValidators();
      this.textoDocumento = "CNPJ (requerido)"
    }
  }

  tipoFornecedorForm(): AbstractControl{
    return this.fornecedorForm.get('tipoFornecedor')!;
  }

  documento(): AbstractControl{
    return this.fornecedorForm.get('documento')!;
  }

  buscarCep(event: Event) {

    this.fornecedorService.consultarCep( (event.target as HTMLTextAreaElement).value)
      .subscribe(
        cepRetorno => this.preencherEnderecoConsulta(cepRetorno),
        erro => this.errors.push(erro));
  }

  preencherEnderecoConsulta(cepConsulta: CepConsulta) {
    this.fornecedorForm.patchValue({
      endereco: {
        logradouro: cepConsulta.logradouro,
        bairro: cepConsulta.bairro,
        //cep: cepConsulta.cep,
        cidade: cepConsulta.localidade,
        estado: cepConsulta.uf
      }
    });
  }

  adicionarFornecedor() {
   if (this.fornecedorForm.dirty && this.fornecedorForm.valid) {
    
    
    this.fornecedor = Object.assign({}, this.fornecedor, this.fornecedorForm.value);
    this.formResult = JSON.stringify(this.fornecedor);
    this.fornecedor.tipoFornecedor = CurrencyUtils.StringParaDecimal(this.fornecedor.tipoFornecedor);
    this.fornecedorService.novoFornecedor(this.fornecedor)
      .subscribe(
        sucesso => { this.processarSucesso(sucesso) },
        falha => { this.processarFalha(falha) }
      );

     this.mudancasNaoSalvas = false;
   }
  }

  processarSucesso(response: any) {
    this.fornecedorForm.reset();
    this.errors = [];

    let toast = this.toastr.success('Fornecedor cadastrado com sucesso!', 'Sucesso!');
    if (toast) {
      toast.onHidden.subscribe(() => {
        this.router.navigate(['/fornecedores/listar-todos']);
      });
    }
  }

  processarFalha(fail: any) {
    this.errors = fail.error.errors;
    this.toastr.error('Ocorreu um erro!', 'Opa :(');
  }
}