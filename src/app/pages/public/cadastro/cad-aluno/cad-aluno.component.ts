import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Aluno } from 'src/app/models/aluno';
import { AlunoService } from 'src/app/services/aluno.service';

@Component({
  selector: 'app-cad-aluno',
  templateUrl: './cad-aluno.component.html',
  styleUrls: ['./cad-aluno.component.css']
})
export class CadAlunoComponent implements OnInit {

  aluno = {} as Aluno;
  formUsuario: FormGroup = new FormGroup({
    nome: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(55)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    formacao: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(55)]),
    idade: new FormControl(0, Validators.required),
    senha: new FormControl('', Validators.required),
    tipo: new FormControl(0, Validators.required)
  });

  get form() {
    return this.formUsuario.controls;
  }

  constructor(
    private seviceAluno: AlunoService, 
    private toastr: ToastrService,
    private route: Router
  ) { }

  ngOnInit(): void {
    this.validacao();
  }

  private validacao() {
    this.formUsuario;
  }

  onSubmit() {
    if(this.formUsuario.valid) {
      this.aluno = { ... this.formUsuario.value};
      this.seviceAluno.incluir(this.aluno).subscribe(
        () => {
          this.toastr.success(`Usuário ${this.aluno.nome} cadastrado com sucesso`);
          this.route.navigate(['/login']);
        },
        (err: any) => {
          console.log(err);
          this.toastr.error('Erro ao salvar ou usuário existente.');
        }
      );
    }
  }

  public ValidarCss(campoForm: FormControl | AbstractControl): any {
    return {'is-valid': campoForm.errors && campoForm.touched};
  }

}
