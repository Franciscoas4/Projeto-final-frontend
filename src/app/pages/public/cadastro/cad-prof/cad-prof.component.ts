import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Professor } from 'src/app/models/professor';
import { ProfessorService } from 'src/app/services/professor.service';

@Component({
  selector: 'app-cad-prof',
  templateUrl: './cad-prof.component.html',
  styleUrls: ['./cad-prof.component.css']
})
export class CadProfComponent implements OnInit {

  professor = {} as Professor;
  formUsuario: FormGroup = new FormGroup({
    nome: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(55)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    senha: new FormControl('', Validators.required),
    tipo: new FormControl(0, Validators.required)
  });

  get form() {
    return this.formUsuario.controls;
  }

  constructor(
    private seviceProfessor: ProfessorService, 
    private toastr: ToastrService,
    private route: Router) { }

  ngOnInit(): void {
    this.validacao();
  }

  private validacao() {
    this.formUsuario;
  }

  onSubmit() {
    if(this.formUsuario.valid) {
      this.professor = { ... this.formUsuario.value};
      this.seviceProfessor.incluir(this.professor).subscribe(
        () => {
          this.toastr.success(`Usuário ${this.professor.nome} cadastrado com sucesso`);
          this.route.navigate(['/login']);
        },
        (err: any) => {
          console.log(err);
          this.toastr.error('Erro ao salvar ou usuário existente.');
        }
      );
    }
    
  }

}
