import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { WordDatabaseComponent } from './words/word-database/word-database.component';
import { LearningComponent } from './learning/learning/learning.component';
import { RepetitionComponent } from './repetition/repetition/repetition.component';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard],},
  { path: 'words', component: WordDatabaseComponent, canActivate: [AuthGuard] },
  { path: 'learning', component: LearningComponent, canActivate: [AuthGuard] },
  { path: 'repetition', component: RepetitionComponent, canActivate: [AuthGuard],},
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
