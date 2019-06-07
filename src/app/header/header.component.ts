import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Subscription} from 'rxjs';
import {supportsYarn} from '@angular/cli/utilities/package-manager';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  authSubs: Subscription;
  user: any;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.user = this.authService.getAuthUser();

    this.authSubs = this.authService.getAuthListner()
      .subscribe(user => {
        this.user = user;
      });
  }

  ngOnDestroy(): void {
    this.authSubs.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }
}
