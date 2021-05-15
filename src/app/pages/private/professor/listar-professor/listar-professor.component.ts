import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Professor } from 'src/app/models/professor';
import { ProfessorService } from 'src/app/services/professor.service';

@Component({
  selector: 'app-listar-professor',
  templateUrl: './listar-professor.component.html',
  styleUrls: ['./listar-professor.component.css']
})
export class ListarProfessorComponent implements OnInit {

  professor: Professor[]
  edtProfessor: Professor;
  textoBotao: string = 'Cadastrar';
  id: any;

  constructor(
    private serviceProfessor: ProfessorService,
    private rota: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.serviceProfessor.obter().subscribe(
      professores => 
       this.professor = professores);

       this.rota.params.subscribe((parametros) => {
         if(parametros['id']){
           this.textoBotao = 'Atualizar';
           this.id = parametros['id'];
           this.serviceProfessor.listarPorId(this.id).subscribe((edt) => {
             this.edtProfessor = edt;
           })
         }
       });
  }

  
}
