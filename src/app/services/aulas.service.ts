import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Aula } from "../models/aula";

const URL = 'http://localhost:3000/stefanini/aula';

@Injectable({
  providedIn: 'root',
})
export class AulaService {
  constructor(private httpClient: HttpClient) {}

  listarPorId(id: number): Observable<Aula> {
    return this.httpClient.get<Aula>(`${URL}/${id}`);
  }

  obter() {
    return this.httpClient.get<Aula[]>(URL);
  }

  incluir(curso: Aula): Observable<Aula> {
    return this.httpClient.post<Aula>(URL, curso);
  }

  alterar(aula: Aula): Observable<Aula> {
    return this.httpClient.put<Aula>(`${URL}/${aula.id}`, aula);
  }

  excluir(id: number): Observable<any> {
    return this.httpClient.delete(`${URL}/${id}`);
  }
  
}