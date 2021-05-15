import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Aluno } from 'src/app/models/aluno';
import { AlunoService } from 'src/app/services/aluno.service';

@Component({
  selector: 'app-aluno-list',
  templateUrl: './aluno-list.component.html',
  styleUrls: ['./aluno-list.component.css']
})
export class AlunoListComponent implements OnInit {

  modRef: BsModalRef;
  alunosFilter: Array<Aluno> = [];
  alunoId: number;
  alunos: Array<Aluno> = [];
  aluno: Aluno;
  filterList = ''; 

  constructor(
    private alunoService: AlunoService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getAlunos();
  }

  get filtro(): string {
    return this.filterList;
  }
  
  set filtro(value: string) {
    this.filterList = value;
    this.alunosFilter = this.filterList ? this.filtrarAlunos(this.filterList) : this.alunos;
  }
  
  getAlunos() { 
    this.alunoService.obter().subscribe(
      (alunos: Aluno[]) => {
        this.alunos = alunos;
        this.alunosFilter = this.alunos;
      }, error => {
        this.toastr.error(`Erro ao tentar carregar alunos: ${error}`);
      }
    );
  }

  filtrarAlunos(filtrarPor: string): Array<Aluno> {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.alunos.filter(
      aluno => aluno.nome.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  

}
