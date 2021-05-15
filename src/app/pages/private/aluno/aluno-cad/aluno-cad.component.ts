import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl, AbstractControl } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Aluno } from 'src/app/models/aluno';
import { Curso } from 'src/app/models/curso';
import { AlunoService } from 'src/app/services/aluno.service';
import { CursoService } from 'src/app/services/curso.service';

@Component({
  selector: 'app-aluno-cad',
  templateUrl: './aluno-cad.component.html',
  styleUrls: ['./aluno-cad.component.css']
})
export class AlunoCadComponent implements OnInit {

  modalRef: BsModalRef;
  alunosFilter: Aluno[];
  alunoId: number;
  alunos: Aluno[];
  aluno: Aluno;
  mSalva = 'Adicionar';  
  formAluno: FormGroup; 
  delAluno = '';  
  filtroLista = '';  
  cursoAtual = {id: 0, nome: '', descricao: '', indice: 0};

  constructor(
    private alunoService: AlunoService,    
    private formBuilder: FormBuilder,    
    private toastr: ToastrService,
    private modalService: BsModalService,
    private cursoService: CursoService
  ) { }

  ngOnInit(): void {
    this.getAlunos();
    this.validacao();
  }

  get cursos(): FormArray {
    return this.formAluno.get('cursos') as FormArray;
  }

  get f(): any {
    return this.formAluno.controls;
  }
  
  get filtro(): string {
    return this.filtroLista;
  }

  get mEdit(): boolean {
    return this.mSalva === 'Editar';
  }

  set filtro(value: string) {
    this.filtroLista = value;
    this.alunosFilter = this.filtroLista ? this.filtrarAlunos(this.filtroLista) : this.alunos;
  }

  editAluno(aluno: Aluno, template: any) {
    this.mSalva = 'Editar';
    this.openModal(template);
    this.aluno = {...aluno};    
    this.formAluno.patchValue(this.aluno);
  }

  novoAluno(template: any) {
    this.mSalva = 'incluir';
    this.openModal(template);
  }

  public salvarCursos(): void {    
    if (this.formAluno.controls.cursos.valid) {
      this.cursoService.incluir(this.formAluno.value)
        .subscribe(
          () => {
            this.toastr.success('Curso salvo com Sucesso!');
          },
          (error: any) => {
            this.toastr.error('Erro ao tentar salvar cursos.');
            console.error(error);
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

  public retornaTituloCurso(nome: string): string {
    return nome === null || nome === '' ? 'Nome do curso' : nome;
  }

  // public removerAula(templateAula: TemplateRef<any>, indice: number): void {
  //   this.aulaAtual.id = this.aulas.get(indice + '.id').value;
  //   this.aulaAtual.nome = this.aulas.get(indice + '.nome').value;
  //   this.aulaAtual.duracao = this.aulas.get(indice + '.duracao').value;
  //   this.aulaAtual.idCurso = this.aulas.get(indice + '.idCurso').value;
  //   this.aulaAtual.indice = indice;

  //   this.modalRef = this.modalService.show(templateAula, {class: 'modal-sm' });
  // }

  confirmDelCurso(): void {
    this.modalRef.hide();
    this.cursoService.excluirCurso(this.alunoId, this.cursoAtual.id)
      .subscribe(
        () => {
          this.toastr.success('Aula deletado com sucesso', 'Sucesso');
          this.cursos.removeAt(this.cursoAtual.indice);
        },
        (error: any) => {
          this.toastr.error(`Erro ao tentar deletar o curso ${this.cursoAtual.id}`, 'Erro');
          console.error(error);
        }
      );
  }

  declineDelCurso(): void {
    this.modalRef.hide();
  }

  validacao() {    
    this.formAluno = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(55)]],     
      email: ['', [Validators.required, Validators.email]],
      formacao: ['', Validators.required],
      idade: ['', Validators.required],
      tipo: ['', Validators.required],
      senha: ['', Validators.required],
      cursos: this.formBuilder.array([])
    });
  }
      
  exclAluno(aluno: Aluno, template: any) {
    this.openModal(template);
    if(aluno.cursos.length > 0) {
      this.toastr.error('Você não pode deletar este aluno, ele está matriculado em curso.');
    } else {
      this.aluno = aluno;
      this.delAluno = `Tem certeza que deseja excluir o Aluno: ${aluno.nome}, Código: ${aluno.id}`;
    }
  }

  confirmDelete(template: any) {
    this.alunoService.excluir(this.aluno.id).subscribe(
      () => {
        template.hide();
        this.getAlunos();
        this.toastr.success('Deletado com Sucesso.');
      }, error => {
        this.toastr.error('Error ao tentar deletar.');
      }
    );
  }

  salvarAlteracao(template: any) {    
    if (this.formAluno.valid) {
      this.aluno = (this.mSalva === 'Adicionar') ? {...this.formAluno.value} : {id: this.aluno.id, ...this.formAluno.value};
      this.alunoService[this.mSalva](this.aluno).subscribe(
        () => {
          template.hide();
          this.getAlunos();
          this.toastr.success('Inserido com Sucesso!');
        },
        (error) => {
          if (this.mSalva === 'Adicionar') {
            this.toastr.error(`Email já existe: ${error}`);
          } else {
            this.toastr.error(`Email não pode ser alterado: ${error}`);
          }
        }
      );
    }
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

  filtrarAlunos(filtrarPor: string): Aluno[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.alunos.filter(
      aluno => aluno.nome.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  public resetForm(): void {
    this.formAluno.reset();
  }
  
  openModal(template: any) {
    this.formAluno.reset();
    template.show();
  }  

  public cssValidator(campoForm: FormControl | AbstractControl): any {
    return {'is-invalid': campoForm.errors && campoForm.touched };
  }

}
