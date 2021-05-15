import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { AuthGuardService } from './guards/auth-guard.service';
import { HttpInterceptorService } from './interceptors/http-interceptor.service';
import { HomeComponent } from './pages/private/home/home.component';
import { ListarProfessorComponent } from './pages/private/professor/listar-professor/listar-professor.component';
import { CadastroComponent } from './pages/public/cadastro/cadastro.component';
import { LoginComponent } from './pages/public/login/login.component';
import { PaginaNaoEncontradaComponent } from './pages/public/pagina-nao-encontrada/pagina-nao-encontrada.component';
import { CadAlunoComponent } from './pages/public/cadastro/cad-aluno/cad-aluno.component';
import { CadProfComponent } from './pages/public/cadastro/cad-prof/cad-prof.component';
import { AreaProfComponent } from './pages/private/professor/area-prof/area-prof.component';
import { CadNovoProfComponent } from './pages/private/professor/cad-novo-prof/cad-novo-prof.component';
import { TituloComponent } from './components/titulo/titulo.component';
import { CursoCadComponent } from './pages/private/cursos/curso-cad/curso-cad.component';
import { CursoListComponent } from './pages/private/cursos/curso-list/curso-list.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SecaoAlunoComponent } from './pages/private/aluno/secao-aluno/secao-aluno.component';
import { AlunoListComponent } from './pages/private/aluno/aluno-list/aluno-list.component';
import { AlunoCadComponent } from './pages/private/aluno/aluno-cad/aluno-cad.component';
import { AuthService } from './services/auth.service';
import { ProfessorService } from './services/professor.service';
import { AlunoService } from './services/aluno.service';

export function tokenGetter() {
  return localStorage.getItem('jwttoken');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ListarProfessorComponent,
    CadastroComponent,
    HomeComponent,
    PaginaNaoEncontradaComponent,
    HeaderComponent,
    CadAlunoComponent,
    CadProfComponent,
    AreaProfComponent,
    CadNovoProfComponent,
    TituloComponent,
    CursoCadComponent,
    CursoListComponent,
    SecaoAlunoComponent,
    AlunoListComponent,
    AlunoCadComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    ModalModule.forRoot(),
    ToastrModule.forRoot(),
    NgbModule,
    BrowserAnimationsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
      },
    }),
  ],
  providers: [
    HttpInterceptorService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true,
    },
    AuthGuardService,
    ProfessorService,
    AlunoService,
    AuthService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
