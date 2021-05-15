import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Curso } from 'src/app/models/curso';
import { Professor } from 'src/app/models/professor';
import { CursoService } from 'src/app/services/curso.service';
import { ProfessorService } from 'src/app/services/professor.service';

@Component({
  selector: 'app-cad-novo-prof',
  templateUrl: './cad-novo-prof.component.html',
  styleUrls: ['./cad-novo-prof.component.css']
})
export class CadNovoProfComponent implements OnInit {

  modRef: BsModalRef;
  profFilter: Array<Professor> = [];
  profId: number;
  professores: Array<Professor> = [];
  professor: Professor;
  mSalva: string = 'Adicionar';
  formProfessor: FormGroup;
  deleteProf = '';
  listaFilter: string;
  cursoAtual = {id: 0, nome: '', descricao: '',idCurso: 0, indice: 0};

  constructor(
    private professorService: ProfessorService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private cursoService: CursoService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getProfessores();
    this.validacao();
  }

  get cursos(): FormArray {
    return this.formProfessor.get('cursos') as FormArray;
  }

  get form(): any {
    return this.formProfessor.controls;
  }
  
  get filtro(): string {
    return this.listaFilter;
  }
  set filtro(value: string) {
    this.listaFilter = value;
    this.profFilter = this.listaFilter ? this.filterProf(this.listaFilter) : this.professores;
  }

  get mEdit(): boolean {
    return this.mSalva === 'Alterar';
  }


  editProfessor(professor: Professor, template: any) {
    this.mSalva = 'Alterar';
    this.openModal(template);
    this.professor = { ...professor};
    this.formProfessor.patchValue(this.professor);
  }

  novoProfessor(template: any) {
    this.mSalva = 'Adicionar';
    this.openModal(template);
  }

  public salvaCurso(): void {
    if (this.formProfessor.controls.cursos.valid) {
      this.cursoService.incluir(this.formProfessor.value)
      .subscribe(
        () => {
          this.toastr.success('Curso incluido com sucesso!');
        },
        (err: any) => {
          this.toastr.error('Erro ao tentar incluir curso.');
          console.log(err);
        }
      );
    }
  }

  addCurso(): void {
    this.cursos.push(this.criarCurso({id: 0} as Curso));
  }

  criarCurso(curso: Curso): FormGroup {
    return this.formBuilder.group({
      id: [curso.id],
      nome: [curso.nome, Validators.required],
      descricao: [curso.descricao, Validators.required],
    });
  }

  public informaNomeCurso(nome: string): string {
    return nome === null || nome === '' ? 'Nome do curso' : nome;
  }
 
  public removeCurso(templateAula: TemplateRef<any>, indice: number): void {
    this.cursoAtual.id = this.cursos.get(indice + '.id').value;
    this.cursoAtual.nome = this.cursos.get(indice + '.nome').value;
    this.cursoAtual.descricao = this.cursos.get(indice + '.descricao').value;
    this.cursoAtual.indice = this.cursos.get(indice + '.id').value;

    this.modRef = this.modalService.show(templateAula, {class: 'modal-sm'});
  }

  confirmaDelCurso(): void {
    this.modRef.hide();
    this.cursoService.excluirCurso(this.profId, this.cursoAtual.id)
    .subscribe(
      () => {
        this.toastr.success('Curso excluido com sucesso.');
        this.cursos.removeAt(this.cursoAtual.indice);
      },
      (err: any) => {
        this.toastr.error(`Erro ao deletar o curso ${this.cursoAtual.id}.`);
        console.error(err);
      }
    );
  }

  naoDeletaCurso(): void {
    this.modRef.hide();
  }

  validacao() {
    this.formProfessor = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(55)]],     
      email: ['', [Validators.required, Validators.email]],      
      senha: ['', Validators.required],
      tipo: ['', Validators.required],
      cursos: this.formBuilder.array([]),
    });
  }

  excluirProfessor(professor: Professor, template: any) {
    this.openModal(template);
    if(professor.cursos.length > 0) {
      this.toastr.error('Professor não pode ser deletado pois possui cursos vinculados.');
    } else {
      this.professor = professor;
      this.deleteProf = `Tem certeza que deseja excluir o professor: ${professor.nome}, Código: ${professor.id}`;
    }
  }

  confirmExclusao(template: any) {
    this.professorService.excluir(this.professor.id).subscribe(
      () => {
        template.hide();
        this.getProfessores();
        this.toastr.success('Excluido com Sucesso.');
      }, error => {
        this.toastr.error('Error ao tentar deletar.', error);
      }
    );
  }

  salvarAlteracao(template: any) {    
    if (this.formProfessor.valid) {
      this.professor = (this.mSalva === 'Adicionar') ? {...this.formProfessor.value} : {id: this.professor.id, ...this.formProfessor.value};
      this.professorService.incluir(this.professor).subscribe(
        () => {
          template.hide();
          this.getProfessores();
          this.toastr.success('Adicionado com Sucesso!');
        },
        (error) => {
          if(this.mSalva === 'Adicionar') {
            this.toastr.error(`E-mail existente: ${error}`);
          } else {
          this.toastr.error(`E-mail não pode ser alterado: ${error}`);
        }
        }
      );
    }
  }

  getProfessores() {
    this.professorService.obter()
    .subscribe(
      (professores: Professor[]) => {
        this.professores = professores;
        this.profFilter = this.professores;
      },
      (err) => {
        this.toastr.error(`Erro ao tentar carregar professores: ${err}`);
      }
    );
  }

  filterProf(filtrar: string): Array<Professor> {
    filtrar = filtrar.toLocaleLowerCase();
    return this.professores.filter(
      (professor) => professor.nome.toLocaleLowerCase().indexOf(filtrar) !== -1
    )
  }

  public formReset(): void {
    this.formProfessor.reset();
  }

  openModal(template: any) {
    this.formProfessor.reset();
    template.show();
  }

  public validarCss(campoForm: FormControl | AbstractControl): any {
    return {'is-invalid': campoForm.errors && campoForm.touched };
  }

}
