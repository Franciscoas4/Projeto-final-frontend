import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-secao-aluno',
  templateUrl: './secao-aluno.component.html',
  styleUrls: ['./secao-aluno.component.css']
})
export class SecaoAlunoComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  listar() {
    this.router.navigate(['lista-cursos']);
  }

  cadAluno() {
    this.router.navigate(['cad-novo-aluno']);
  }

  professores() {
    this.router.navigate(['list-professor']);
  }

}
