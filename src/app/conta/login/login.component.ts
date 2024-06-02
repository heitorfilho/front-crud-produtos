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
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, AfterViewInit{

  @ViewChildren(FormControlName, { read: ElementRef }) 
  formInputElements!: ElementRef[];
  
  loginForm!: FormGroup;
  usuario!: Usuario;

  displayMessage: DisplayMessage = {};
  genericValidator!: GenericValidator;
  validationMessages!: ValidationMessages;

  errors: any[] = [];


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
      }
    }
    this.genericValidator = new GenericValidator(this.validationMessages);
   }

  ngOnInit(): void {

    // usar customValidator -> necessario criar formControl por fora
    // let senha = new FormControl('', [Validators.required, CustomValidators.rangeLength([6, 15])]);
    
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, CustomValidators.rangeLength([6, 15])]]
    })
  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
            .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

        merge(...controlBlurs).subscribe(() => {
            this.displayMessage = this.genericValidator.processarMensagens(this.loginForm);
        });
  }
  
  login(){
    if (this.loginForm.dirty && this.loginForm.valid) {
      this.usuario = Object.assign({}, this.usuario, this.loginForm.value);

      this.contaService.login(this.usuario)
        .subscribe(
          sucesso => {this.processarSucesso(sucesso)},
          falha => {this.processarFalha(falha)}
        );
    }
  }

  processarSucesso(response: any) {
    this.loginForm.reset();
    this.errors = [];

    this.contaService.LocalStorage.salvarDadosLocaisUsuario(response);

    // set timeout
    let toast = this.toastr.success('Login realizado com Sucesso!', 'Bem vindo!!!', {timeOut: 500});
    if (toast) {
      toast.onHidden.subscribe(() => {
        this.router.navigate(['/home']);
      });
    }

    //this.router.navigate(['/home']);
  }

  processarFalha(fail: any) {
    this.errors = fail.error.errors;
    this.toastr.error('Ocorreu um erro!', 'Opa :(');
  }


}
