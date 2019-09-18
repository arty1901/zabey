import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PostListComponent} from './post/post-list/post-list.component';
import {PostCreateComponent} from './post/post-create/post-create.component';
import {LoginComponent} from './auth/login/login.component';
import {SignupComponent} from './auth/signup/signup.component';
import {AuthGuard} from './middleware/auth.guard';
import {UserComponent} from './account/user.component';
import {UserInfoComponent} from './account/user-info/user-info.component';
import {UserPostsComponent} from './account/user-posts/user-posts.component';
import {PostPageComponent} from './post/post-page/post-page.component';
import {SearchComponent} from './search/search.component';

const routes: Routes = [
  {path: '', redirectTo: '/posts', pathMatch: 'full'},
  {path: 'posts', component: PostListComponent},
  {path: 'post/:id', component: PostPageComponent},
  {path: 'create', component: PostCreateComponent, canActivate: [AuthGuard]},
  {path: 'edit/:id', component: PostCreateComponent, canActivate: [AuthGuard]},
  {path: 'account', component: UserComponent, canActivate: [AuthGuard], children: [
      {path: '', redirectTo: '/account/info', pathMatch: 'full'},
      {path: 'info', component: UserInfoComponent},
      {path: 'posts', component: UserPostsComponent},
    ]},
  {path: 'search', component: SearchComponent},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {
}
