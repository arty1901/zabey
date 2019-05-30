import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  authSubs: Subscription;
  isAuth = false;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.isAuth = this.authService.getAuthStatus();
    this.authSubs = this.authService.getAuthListner()
      .subscribe(status => {
        this.isAuth = status;
      });
  }

  ngOnDestroy(): void {
    this.authSubs.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }
}
