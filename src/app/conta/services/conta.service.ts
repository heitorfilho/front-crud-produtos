import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Usuario } from "../models/usuario";
import { catchError, map, Observable } from "rxjs";
import { BaseService } from "../../services/base.services";

@Injectable()
export class ContaService extends BaseService{

    constructor(private http: HttpClient) { super() }

    registrarUsuario(usuario: Usuario) : Observable<Usuario> {
        //console.log(usuario);
        let response = this.http
            .post(this.UrlServiceV1 +  'nova-conta', usuario, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));
        
        return <Observable<Usuario>>response;
    }
    
    login(usuario: Usuario) : Observable<Usuario>{
        let response = this.http
            .post(this.UrlServiceV1 + 'entrar', usuario, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return <Observable<Usuario>>response;
    }
}