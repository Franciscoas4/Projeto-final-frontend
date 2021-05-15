import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Curso } from 'src/app/models/curso';
import { CursoService } from 'src/app/services/curso.service';

@Component({
  selector: 'app-curso-list',
  templateUrl: './curso-list.component.html',
  styleUrls: ['./curso-list.component.css']
})
export class CursoListComponent implements OnInit {

  modRef: BsModalRef;
  public cursos: Curso[] = [];
  public cursosFilter: Curso[] = [];
  public cursoId = 0;

  private filtroList = '';

  public get filtroLista(): string {
    return this.filtroList;
  }

  public set filtroLista(value: string) {
    this.filtroList = value;
    this.cursosFilter = this.filtroLista ? this.filterCursos(this.filtroLista) : this.cursos;
  }

  public filterCursos(filtrarPor: string): Curso[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.cursos.filter(
      curso => curso.nome.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  constructor(
    private cursoService: CursoService,    
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.loadCursos();
  }

  public loadCursos(): void {
    this.cursoService.obter().subscribe({
      next: (cursos: Curso[]) => {
        this.cursos = cursos;
        this.cursosFilter = this.cursos;
      },
      error: (err: any) => {
        this.toastr.error('Error ao listar cursos');
      }
    });
  }

  matCurso(nome) {
    alert(nome);
  }

}
