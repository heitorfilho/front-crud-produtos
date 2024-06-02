import { AfterViewInit, Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { DisplayMessage, GenericValidator, ValidationMessages } from '../../utils/generic-form-validation';
//import { CustomValidators } from 'ngx-custom-validators';
import { CustomValidators } from 'ng2-validation';

import { fromEvent, merge, Observable } from 'rxjs';

import { Usuario } from '../models/usuario';
import { ContaService } from '../services/conta.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  providers: [],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css'
})
export class CadastroComponent implements OnInit, AfterViewInit{

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements!: ElementRef[];
  
  cadastroForm!: FormGroup;
  usuario!: Usuario;

  errors: any[] = [];

  displayMessage: DisplayMessage = {};
  genericValidator!: GenericValidator;
  validationMessages!: ValidationMessages;

  mudancasNaoSalvas!: boolean;

  constructor(private fb: FormBuilder, private contaService: ContaService,
      private router: Router,
      private toastr: ToastrService
  ) {
    
    this.validationMessages = {
      email: {
        required: 'Informe o e-mail',
        email: 'Email inválido'
      },
      password: {
        required: 'Informe a senha',
        rangeLength: 'A senha deve possuir entre 6 e 15 caracteres'
      },
      confirmPassword: {
        required: 'Informe a senha novamente',
        rangeLength: 'A senha deve possuir entre 6 e 15 caracteres',
        equalTo: 'As senhas não conferem'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {

    let senha = new FormControl('', [Validators.required, CustomValidators.rangeLength([6, 15])]);
    let senhaConfirm = new FormControl('', [Validators.required, CustomValidators.rangeLength([6, 15]), CustomValidators.equalTo(senha)]);

    //let senha = new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]);
    //let senhaConfirm = new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]);

    this.cadastroForm = this.fb.group({
      email: ['',  [Validators.required, Validators.email]],
      password: senha,
      confirmPassword: senhaConfirm
    });
  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
            .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

        merge(...controlBlurs).subscribe(() => {
            this.displayMessage = this.genericValidator.processarMensagens(this.cadastroForm);
            this.mudancasNaoSalvas = true;
        });
  }

  validarFormulario(formGroup: any) {
    throw new Error('Method not implemented.');
  }

  adicionarConta(){
    if (this.cadastroForm.dirty && this.cadastroForm.valid) {
      this.usuario = Object.assign({}, this.usuario, this.cadastroForm.value);

      this.contaService.registrarUsuario(this.usuario)
        .subscribe(
          sucesso => {this.processarSucesso(sucesso)},
          falha => {this.processarFalha(falha)}
        );

        this.mudancasNaoSalvas = false;
    }
  }

  processarSucesso(response: any) {
    this.cadastroForm.reset();
    this.errors = [];

    this.contaService.LocalStorage.salvarDadosLocaisUsuario(response);

    let toast = this.toastr.success('Registro realizado com Sucesso!', 'Bem vindo!!!');
    if (toast) {
      toast.onHidden.subscribe(() => {
    this.router.navigate(['/home']);
      });
    }
  }

  processarFalha(fail: any) {
    this.errors = fail.error.errors;
    this.toastr.error('Ocorreu um erro!', 'Opa :(');
  }
  
}
