import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SearchService} from '../services/search.service';
import {Subscription} from 'rxjs';
import {PageEvent} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {

  // TODO: add search form in nav panel

  dataSub: Subscription;

  data: [];
  isLoading = false;
  pageSize = 5;
  totalPosts = 10;
  currentPage = 1;
  pageSizeOption = [1, 3, 5, 7];

  form: FormGroup;

  constructor(private route: ActivatedRoute,
              private searchService: SearchService,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      query: ['', Validators.compose([Validators.required])],
      type: ['']
    });

    this.dataSub = this.searchService.getSearchResultListner()
      .subscribe(data => {

        this.data = data.data;
        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    this.dataSub.unsubscribe();
  }

  onChangePage(event: PageEvent) {
    // this.isLoading = true;
    // this.currentPage = event.pageIndex + 1;
    // this.pageSize = event.pageSize;
    // this.postService.getUserPosts(this.pageSize, this.currentPage);
  }

  onSearch() {
    this.isLoading = true;
    const request = this.form.value.query;
    const type = this.form.value.type;

    if (type === 'request') {
      this.searchService.searchByForm(request);
    } else {
      this.searchService.searchByTag(request);
    }
  }
}
