import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Aluno } from '../models/aluno';

const URL = 'http://localhost:3000/stefanini/aluno';

@Injectable({
  providedIn: 'root',
})
export class AlunoService {
  constructor(private httpClient: HttpClient) {}

  listar(filtro: Partial<Aluno>): Observable<Aluno[]> {
    return this.httpClient.get<Aluno[]>(`${URL}/${filtro}`);
  }

  obter(): Observable<Aluno[]> {
    return this.httpClient.get<Aluno[]>(URL);
  }

  incluir(aluno: Aluno): Observable<Aluno> {
    return this.httpClient.post<Aluno>(URL, aluno);
  }

  alterar(aluno: Aluno): Observable<Aluno> {
    return this.httpClient.put<Aluno>(`${URL}/${aluno.id}`, aluno);
  }

  excluir(id: number): Observable<any> {
    return this.httpClient.delete(`${URL}/${id}`);
  }

  obterPorId(id: number): Observable<Aluno> {
    return this.httpClient.get<Aluno>(`${URL}/${id}`);
  }
}
