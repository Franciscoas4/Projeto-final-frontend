import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Curso } from "../models/curso";

const URL = 'http://localhost:3000/stefanini/curso';

@Injectable({
  providedIn: 'root',
})
export class CursoService {
  constructor(private httpClient: HttpClient) {}

  listarPorId(id: number): Observable<Curso> {
    return this.httpClient.get<Curso>(`${URL}/${id}`);
  }

  obter(): Observable<Curso[]> {
    return this.httpClient.get<Curso[]>(URL);
  }

  incluir(curso: Curso): Observable<Curso> {
    return this.httpClient.post<Curso>(URL, curso);
  }

  alterar(curso: Curso): Observable<Curso> {
    return this.httpClient.put<Curso>(URL, curso);
  }

  excluir(id: number): Observable<any> {
    return this.httpClient.delete(`${URL}/${id}`);
  }

  public excluirCurso(profId: number, cursoId: number): Observable<any> {
      return this.httpClient.delete(`${URL}/${profId}/${cursoId}`);
  }
  
}