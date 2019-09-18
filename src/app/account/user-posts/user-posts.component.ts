import {Component, OnDestroy, OnInit} from '@angular/core';
import {PostService} from '../../services/post.service';
import {Subscription} from 'rxjs';
import {PageEvent} from '@angular/material';
import {assertDataInRange} from '@angular/core/src/render3/assert';

@Component({
  selector: 'app-user-posts',
  templateUrl: './user-posts.component.html',
  styleUrls: ['./user-posts.component.css']
})
export class UserPostsComponent implements OnInit, OnDestroy {


  userPostsSubscription: Subscription;

  isLoading = false;
  posts = [];
  pageSize = 5;
  totalPosts = 10;
  currentPage = 1;
  pageSizeOption = [1, 3, 5, 7];

  constructor(private postService: PostService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.postService.getUserPosts(this.pageSize, this.currentPage);

    this.userPostsSubscription = this.postService.getUserPostsListner()
      .subscribe(data => {
        this.totalPosts = data.count;
        this.posts = data.posts;
        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    this.userPostsSubscription.unsubscribe();
  }

  onChangePage(event: PageEvent) {
    this.isLoading = true;
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.postService.getUserPosts(this.pageSize, this.currentPage);
  }

}
