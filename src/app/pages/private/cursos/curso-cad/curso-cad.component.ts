import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, AbstractControl, FormControl } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Aula } from 'src/app/models/aula';
import { Curso } from 'src/app/models/curso';
import { Professor } from 'src/app/models/professor';
import { AulaService } from 'src/app/services/aulas.service';
import { CursoService } from 'src/app/services/curso.service';
import { ProfessorService } from 'src/app/services/professor.service';

@Component({
  selector: 'app-curso-cad',
  templateUrl: './curso-cad.component.html',
  styleUrls: ['./curso-cad.component.css']
})
export class CursoCadComponent implements OnInit {

  modRef: BsModalRef;
  cursosFilter: Array<Curso> = [];
  cursoId: number;
  cursos: Array<Curso> = [];
  curso: Curso;
  mSalva: string = 'Adicionar';  
  formCurso: FormGroup; 
  delCurso = '';  
  filtroLista = '';  
  aulaAtual = {id: 0, nome: '', duracao: '', idCurso: 0, indice: 0};


  constructor(
    private professorService: ProfessorService,
    private cursoService: CursoService,    
    private formBuilder: FormBuilder,    
    private toastr: ToastrService,
    private modalService: BsModalService,
    private aulaService: AulaService
  ) { }

  ngOnInit(): void {
    this.getCursos();
    this.validacao();
  }

  get aulas(): FormArray {
    return this.formCurso.get('aulas') as FormArray;
  }

  get f(): any {
    return this.formCurso.controls;
  }
  
  get filtro(): string {
    return this.filtroLista;
  }

  get mEdit(): boolean {
    return this.mSalva === 'Editar';
  }

  set filtro(value: string) {
    this.filtroLista = value;
    this.cursosFilter = this.filtroLista ? this.cursoFilter(this.filtroLista) : this.cursos;
  }

  editCurso(curso: Curso, template: any) {
    this.mSalva = 'Editar';
    this.openModal(template);
    this.curso = {...curso};    
    this.formCurso.patchValue(this.curso);
  }

  novoCurso(template: any) {
    this.mSalva = 'incluir';
    this.openModal(template);
  }

  public salvarAulas(): void {    
    if (this.formCurso.controls.aulas.valid) {
      this.aulaService.incluir(this.formCurso.value)
        .subscribe(
          () => {
            this.toastr.success('Aulas salva com Sucesso!', 'Sucesso!');
          },
          (error: any) => {
            this.toastr.error('Erro ao tentar salvar aulas.', 'Erro');
            console.error(error);
          }
        );
    }
  }

  addAula(): void {
    this.aulas.push(this.criarAula({id: 0} as Aula));
  }
  
  criarAula(aula: Aula): FormGroup {
    return this.formBuilder.group({
      id: [aula.id],
      nome: [aula.nome, Validators.required],
      duracao: [aula.duracao, Validators.required],
      idCurso: [aula.idCurso, Validators.required],
      topicos: [aula.idCurso, Validators.required],
    });
  }

  public retornaTituloAula(nome: string): string {
    return nome === null || nome === '' ? 'Nome da aula' : nome;
  }

  // public removerAula(templateAula: TemplateRef<any>, indice: number): void {
  //   this.aulaAtual.id = this.aulas.get(indice + '.id').value;
  //   this.aulaAtual.nome = this.aulas.get(indice + '.nome').value;
  //   this.aulaAtual.duracao = this.aulas.get(indice + '.duracao').value;
  //   this.aulaAtual.idCurso = this.aulas.get(indice + '.idCurso').value;
  //   this.aulaAtual.indice = indice;

  //   this.modalRef = this.modalService.show(templateAula, {class: 'modal-sm' });
  // }

  // confirmDeleteAula(): void {
  //   this.modalRef.hide();
  //   this.aulaService.excluirAula(this.cursoId, this.aulaAtual.id)
  //     .subscribe(
  //       () => {
  //         this.toastr.success('Aula deletado com sucesso', 'Sucesso');
  //         this.aulas.removeAt(this.aulaAtual.indice);
  //       },
  //       (error: any) => {
  //         this.toastr.error(`Erro ao tentar deletar a aula ${this.aulaAtual.id}`, 'Erro');
  //         console.error(error);
  //       }
  //     );
  // }

  // declineDeleteAula(): void {
  //   this.modalRef.hide();
  // }

  validacao() {
    this.formCurso = this.formBuilder.group({
      nome: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      descricao: [null, Validators.required],      
      idProfessor: [null, Validators.required],  
      aulas: this.formBuilder.array([])
    });
  }
      
  exclCurso(curso: Curso, template: any) {
    this.openModal(template);
    if(curso.aulas.length > 0) {
      this.toastr.error(`O curso ${curso.nome} não pode ser deletado, pois há aulas anexadas.`);
    } else {
      this.curso = curso;
      this.delCurso = `Tem certeza que deseja excluir o Curso: ${curso.nome}, Código: ${curso.id}`;
    }
  }

  confirmDelete(template: any) {
    this.cursoService.excluir(this.curso.id).subscribe(
      () => {
        template.hide();
        this.getCursos();
        this.toastr.success('Deletado com Sucesso.');
      }, error => {
        this.toastr.error('Error ao tentar deletar.');
      }
    );
  }
    
  salvarAlteracao(template: any) {    
    if (this.formCurso.valid) {
      this.curso = (this.mSalva === 'Adicionar') ? {...this.formCurso.value} : {...this.formCurso.value};
      this.cursoService.incluir(this.curso).subscribe(
        () => {
          template.hide();
          this.getCursos();
          this.toastr.success('Inserido com Sucesso!');
        },
        (error) => {
          this.toastr.error(`Erro ao Inserir: ${error}`);
        }
      );
    }
  }

  getCursos() {
    this.cursoService.obter().subscribe(
      (cursos: Curso[]) => {
        this.cursos = cursos;
        this.cursosFilter = this.cursos;
      },
      (err) => {
        this.toastr.error(`Erro ao tentar listar cursos: ${err}`);
      }
    );
  }

  cursoFilter(filtrar: string): Array<Curso> {
    filtrar = filtrar.toLocaleLowerCase();
    return this.cursos.filter(
      (curso) => curso.nome.toLocaleLowerCase().indexOf(filtrar) !== -1
    );
  }

  public reset(): void {
    this.formCurso.reset();
  }

  openModal(template: any) {
    this.formCurso.reset();
    template.show();
  }

  public validarCss(campoForm: FormControl | AbstractControl): any {
    return {'is-invalid': campoForm.errors && campoForm.touched };
  }

}
