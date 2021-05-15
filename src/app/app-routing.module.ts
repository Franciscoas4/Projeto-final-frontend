import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './guards/auth-guard.service';
import { AlunoCadComponent } from './pages/private/aluno/aluno-cad/aluno-cad.component';
import { AlunoListComponent } from './pages/private/aluno/aluno-list/aluno-list.component';
import { SecaoAlunoComponent } from './pages/private/aluno/secao-aluno/secao-aluno.component';
import { CursoCadComponent } from './pages/private/cursos/curso-cad/curso-cad.component';
import { CursoListComponent } from './pages/private/cursos/curso-list/curso-list.component';
import { HomeComponent } from './pages/private/home/home.component';
import { AreaProfComponent } from './pages/private/professor/area-prof/area-prof.component';
import { CadNovoProfComponent } from './pages/private/professor/cad-novo-prof/cad-novo-prof.component';
import { ListarProfessorComponent } from './pages/private/professor/listar-professor/listar-professor.component';
import { CadAlunoComponent } from './pages/public/cadastro/cad-aluno/cad-aluno.component';
import { CadProfComponent } from './pages/public/cadastro/cad-prof/cad-prof.component';
import { CadastroComponent } from './pages/public/cadastro/cadastro.component';
import { LoginComponent } from './pages/public/login/login.component';
import { PaginaNaoEncontradaComponent } from './pages/public/pagina-nao-encontrada/pagina-nao-encontrada.component';

const routes: Routes = [
  { path: 'aluno', component: SecaoAlunoComponent, canActivate: [AuthGuardService] },
  { path: 'aluno-cad', component: AlunoCadComponent, canActivate: [AuthGuardService] },
  { path: 'aluno-list', component: AlunoListComponent, canActivate: [AuthGuardService] },
  
  { path: 'area-professor', component: AreaProfComponent, canActivate: [AuthGuardService] },
  { path: 'professor-novo', component: CadNovoProfComponent, canActivate: [AuthGuardService] },
  { path: 'professor-list', component: ListarProfessorComponent, canActivate: [AuthGuardService] },
  { path: 'curso-cad', component: CursoCadComponent, canActivate: [AuthGuardService] },
  
  { path: 'curso-cad/:id', component: CursoCadComponent, canActivate: [AuthGuardService] },
  { path: 'curso-list', component: CursoListComponent, canActivate: [AuthGuardService] },
  { path: '', canActivate: [AuthGuardService], component: HomeComponent },
  
  { path: 'cad-prof', component: CadProfComponent },
  { path: 'cad-aluno', component: CadAlunoComponent },
  { path: 'nova-conta', component: CadastroComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', component: PaginaNaoEncontradaComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
