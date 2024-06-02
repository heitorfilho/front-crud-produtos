import { Component, OnInit, ViewChildren, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControlName, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';

import { Observable, fromEvent, merge } from 'rxjs';

import { ToastrService } from 'ngx-toastr';


import { Fornecedor } from '../models/fornecedor';
import { CepConsulta, Endereco } from '../models/endereco';
import { FornecedorService } from '../services/fornecedor.service';
import { ValidationMessages, GenericValidator, DisplayMessage } from '../../utils/generic-form-validation';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ListaProdutosComponent } from "../produtos/lista-produtos.components";
import { CurrencyUtils } from '../../utils/currency-utils';

@Component({
    selector: 'app-editar',
    templateUrl: './editar.component.html',
    standalone: true,
    imports: [CommonModule, RouterLink, ReactiveFormsModule, ListaProdutosComponent]
})
export class EditarComponent implements OnInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements!: ElementRef[];



  // TESTE MODAL
  @ViewChild('dialog') dialog!: ElementRef<HTMLDialogElement>;




  errors: any[] = [];
  errorsEndereco: any[] = [];
  fornecedorForm!: FormGroup;
  enderecoForm!: FormGroup;

  fornecedor: Fornecedor = new Fornecedor();
  endereco: Endereco = new Endereco();

  validationMessages: ValidationMessages;
  genericValidator: GenericValidator;
  displayMessage: DisplayMessage = {};
  textoDocumento: string = '';

  tipoFornecedor!: number;
  formResult: string = '';

  mudancasNaoSalvas!: boolean;

  constructor(private fb: FormBuilder,
    private fornecedorService: FornecedorService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private modalService: NgbModal) {

    this.validationMessages = {
      nome: {
        required: 'Informe o Nome',
      },
      documento: {
        required: 'Informe o Documento'
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

    this.fornecedor = this.route.snapshot.data['fornecedor'];
    this.tipoFornecedor = this.fornecedor.tipoFornecedor;
  

    // this.fornecedorService.obterPorId(this.route.snapshot.params['id'])
    //   .subscribe(fornecedor => this.fornecedor = fornecedor);
  }

  ngOnInit() {

    this.fornecedorForm = this.fb.group({
      id: '',
      nome: ['', [Validators.required]],
      documento: ['', [Validators.required]],
      ativo: ['', [Validators.required]],
      tipoFornecedor: ['', [Validators.required]]
    });

    this.enderecoForm = this.fb.group({
      id: '',
      logradouro: ['', [Validators.required]],
      numero: ['', [Validators.required]],
      complemento: [''],
      bairro: ['', [Validators.required]],
      cep: ['', [Validators.required]],
      cidade: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      fornecedorId: ''
    });

    this.preencherForm();
  }

  preencherForm() {

    if (this.fornecedor) {
      this.fornecedorForm.patchValue({
        id: this.fornecedor.id,
        nome: this.fornecedor.nome,
        ativo: this.fornecedor.ativo,
        tipoFornecedor: this.fornecedor.tipoFornecedor.toString(),
        documento: this.fornecedor.documento
      });
    }

    if (this.fornecedor.endereco) {
      this.enderecoForm.patchValue({
        id: this.fornecedor.endereco.id,
        logradouro: this.fornecedor.endereco.logradouro,
        numero: this.fornecedor.endereco.numero,
        complemento: this.fornecedor.endereco.complemento,
        bairro: this.fornecedor.endereco.bairro,
        cep: this.fornecedor.endereco.cep,
        cidade: this.fornecedor.endereco.cidade,
        estado: this.fornecedor.endereco.estado
      });
    }
  }

  ngAfterViewInit() {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    merge(...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processarMensagens(this.fornecedorForm);
      this.mudancasNaoSalvas = true;
    });

    // TESTE MODAL
    // this.dialog.nativeElement.addEventListener('click', (event: MouseEvent) => {
    //   const target = event.target as Element;
    //   if (target.nodeName === 'DIALOG') {
    //     this.closeModal();
    //   }
    // });
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
        cep: cepConsulta.cep,
        cidade: cepConsulta.localidade,
        estado: cepConsulta.uf
      }
    });
  }
  

  editarFornecedor() {
    if (this.fornecedorForm.dirty && this.fornecedorForm.valid) {

      this.fornecedor = Object.assign({}, this.fornecedor, this.fornecedorForm.value);

      this.fornecedor.tipoFornecedor = CurrencyUtils.StringParaDecimal(this.fornecedor.tipoFornecedor);

      this.fornecedorService.atualizarFornecedor(this.fornecedor, this.fornecedor.id)
        .subscribe(
          sucesso => { this.processarSucesso(sucesso) },
          falha => { this.processarFalha(falha) }
        );

      this.mudancasNaoSalvas = false;
    }
  }

  editarEndereco() {
    // if (this.enderecoForm.dirty && this.enderecoForm.valid) {

    //   this.endereco = Object.assign({}, this.endereco, this.enderecoForm.value);

    //   this.endereco.cep = StringUtils.somenteNumeros(this.endereco.cep);
    //   this.endereco.fornecedorId = this.fornecedor.id;

    //   this.fornecedorService.atualizarEndereco(this.endereco)
    //     .subscribe(
    //       () => this.processarSucessoEndereco(this.endereco),
    //       falha => { this.processarFalhaEndereco(falha) }
    //     );
    // }
  }

  documento(): AbstractControl {
    return this.fornecedorForm.get('documento')!;
  }

  tipoFornecedorForm(): AbstractControl {
    return this.fornecedorForm.get('tipoFornecedor')!;
  }

  processarSucesso(response: any) {
    this.errors = [];

    let toast = this.toastr.success('Fornecedor atualizado com sucesso!', 'Sucesso!');
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

  abrirModal(content: any) {
    this.modalService.open(content, {'backdrop': false});
  }

  fecharModal(){
    this.modalService.dismissAll();
  }

  // closeModal(content: any) {
  //   this.modalService.close(content);
  // }

  // closeModal() {
  //   this.dialog.nativeElement.close();
  //   this.dialog.nativeElement.classList.remove('opened');
  // }

  // openModal() {
  //   this.dialog.nativeElement.showModal();
  //   this.dialog.nativeElement.classList.add('opened');
  // }
}
