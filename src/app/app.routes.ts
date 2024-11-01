import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from './core/services/auth-guard/auth.guard'; // Import the guard

import { AuthLayoutComponent } from './features/auth-layout/auth-layout.component';
import { UserLayoutComponent } from './features/user-layout/user-layout.component';
import { DashboardComponent } from './shared/components/dashboard/dashboard.component';
import { AdminLayoutComponent } from './features/admin-layout/admin-layout.component';
import { DocumentsComponent } from './shared/components/documents/documents.component';
import { IncomingComponent } from './shared/components/incoming/incoming.component';
import { ReceivedComponent } from './shared/components/received/received.component';
import { OutgoingComponent } from './shared/components/outgoing/outgoing.component';
import { ElogsComponent } from './shared/components/elogs/elogs.component';
import { ViewDetailsComponent } from './shared/components/view-details/view-details.component';
import { UserManagementComponent } from './features/admin-layout/user-management/user-management.component';
import { OfficeManagementComponent } from './features/admin-layout/office-management/office-management.component';
import { CatergoryManagementComponent } from './features/admin-layout/catergory-management/catergory-management.component';
import { UserDetailComponent } from './features/admin-layout/user-management/user-detail/user-detail.component';
import { OfficeEditComponent } from './features/admin-layout/office-management/office-edit/office-edit.component';
import { CompletedComponent } from './shared/components/completed/completed.component';
import { CreateUserComponent } from './features/admin-layout/user-management/create-user/create-user.component';
import { ProfileComponent } from './shared/components/profile/profile.component';
import { GenerateComponent } from './shared/components/elogs/generate/generate.component';
import { ReceiveDocumentComponent } from './shared/components/receive-document/receive-document.component';
import { ReleaseDocumentComponent } from './shared/components/release-document/release-document.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: AuthLayoutComponent,
  },
  {
    path: 'user',
    component: UserLayoutComponent,
    canActivate: [AuthGuard], // Protect user layout
    data: { role: 'user' }, // Only allow users with 'user' role
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'documents', component: DocumentsComponent },
      { path: 'incoming', component: IncomingComponent },
      { path: 'received', component: ReceivedComponent },
      { path: 'outgoing', component: OutgoingComponent },
      { path: 'completed', component: CompletedComponent},
      { path: 'e-logs', component: ElogsComponent },
      { path: 'view-details/:documentCode', component: ViewDetailsComponent }, // Updated route with parameter
      { path: 'profile', component: ProfileComponent },
      { path: 'generate', component: GenerateComponent},
      { path: 'documents-receive', component: ReceiveDocumentComponent},  
      { path: 'document-release', component: ReleaseDocumentComponent},  
    ],
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard], // Protect admin layout
    data: { role: 'admin' }, // Only allow users with 'admin' role
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'documents', component: DocumentsComponent },
      { path: 'incoming', component: IncomingComponent },
      { path: 'received', component: ReceivedComponent },
      { path: 'outgoing', component: OutgoingComponent },
      { path: 'completed', component: CompletedComponent},
      { path: 'e-logs', component: ElogsComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'generate', component: GenerateComponent},
      { path: 'user-management', component: UserManagementComponent },
      { path: 'office-management', component: OfficeManagementComponent },
      { path: 'category-management', component: CatergoryManagementComponent },
      { path: 'user-detail/:id', component: UserDetailComponent },
      { path: 'office-edit/:id', component: OfficeEditComponent },
      { path: 'create-user', component: CreateUserComponent},
      { path: 'view-details/:documentCode', component: ViewDetailsComponent }, // Updated route with parameter 
      { path: 'documents-receive', component: ReceiveDocumentComponent},
      { path: 'document-release', component: ReleaseDocumentComponent},    
    ],
  },
  {
    path: '**',
    redirectTo: '/login', // or a 404 page
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
