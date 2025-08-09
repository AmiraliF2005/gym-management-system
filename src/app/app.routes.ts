import { RouterModule, Routes } from '@angular/router';
import { Contact } from './Users/contact/contact';
import { MemberList } from './members/member-list/member-list';
import { TrainerList } from './trainers/trainer-list/trainer-list';
import { TrainerForm } from './trainers/trainer-form/trainer-form';
import { AddTrainer } from './trainers/add-trainer/add-trainer';
import { EditTrainer } from './trainers/edit-trainer/edit-trainer';
import { MemberForm } from './members/member-form/member-form';
import { MemberDetail } from './members/member-detail/member-detail';
import { ClassForm } from './classes/class-form/class-form';
import { ClassList } from './classes/class-list/class-list';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';
import { JwtModule, JwtInterceptor } from '@auth0/angular-jwt';
import { AuthService } from './services/auth.service';
import { ClassService } from './services/class-service';
import { TrainerService } from './services/trainerService';
import { Login } from './Auth/login/login';
import { Register } from './Auth/register/register';
import { App } from './app';
import { Home } from './home/home';


export function tokenGetter() {
    return localStorage.getItem('token');
}

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'contact', component: Contact },
  {
    path: 'members',
    component: MemberList,
    children: [
      { path: 'add', component: MemberForm },
      { path: ':id', component: MemberDetail },
      { path: ':id/edit', component: MemberForm }
    ]
  },
  { path: 'trainers', component: TrainerList },
  { path: 'trainer-form', component: TrainerForm },
  { path: 'trainers/add', component: AddTrainer },
  { path: 'trainers/edit/:id', component: EditTrainer },
  { path: 'class-form', component: ClassForm },
  { path: 'classes', component: ClassList },
  { path: 'class-form/:id', component: ClassForm },
  { path: 'register', component: Register },
  { path: 'login', component: Login },
];

// @NgModule({
//   declarations: [
//     App,
//     Register,
//     Login,
//     TrainerForm,
//     TrainerList,
//     ClassForm,
//     ClassList,
//     AddTrainer,
//     EditTrainer,
//     MemberDetail,
//     MemberForm,
//     MemberList,
//     Contact,
    
//   ],
//   imports: [
//     BrowserModule,
//     FormsModule,
//     ReactiveFormsModule,
//     HttpClientModule,
//     MatCardModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatSelectModule,
//     MatButtonModule,
//     MatIconModule,
//     MatTableModule,
//     RouterModule.forRoot(routes),
//     JwtModule.forRoot({
//       config: {
//         tokenGetter: () => localStorage.getItem('token'),
//         allowedDomains: ['localhost:7213']
//       }
//     })
//   ],
//   providers: [
//     AuthService,
//     ClassService,
//     TrainerService,
//     { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
//   ],
//   bootstrap: [App]
// })

