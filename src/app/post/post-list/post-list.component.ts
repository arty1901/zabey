import {Component, OnInit, OnDestroy} from '@angular/core';
import {PostService} from '../../services/post.service';
import {PostModel} from '../../models/post.model';
import {Subscription} from 'rxjs';
import {PageEvent} from '@angular/material';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: PostModel[] = [];
  postSubscription: Subscription;
  authSub: Subscription;

  isLoading = false;
  pageSize = 10;
  totalPosts = 10;
  currentPage = 1;
  pageSizeOption = [5, 10, 25, 100];
  userId: string;
  isAuth = false;

  constructor(private postService: PostService,
              private authService: AuthService) {
  }

  ngOnInit() {

    this.isLoading = true;
    this.postService.getPosts(this.pageSize, this.currentPage);

    this.isAuth = this.authService.getAuthUser().isAuth;
    this.userId = this.authService.getUserId();

    this.postSubscription = this.postService.getPostListner()
      .subscribe(posts => {
        this.posts = posts.posts;
        this.totalPosts = posts.postCount;
        this.isLoading = false;
      });

    this.authSub = this.authService.getAuthListner()
      .subscribe(status => {
        this.userId = this.authService.getUserId();
        this.isAuth = status.isAuth;
      });

  }

  ngOnDestroy() {
    this.postSubscription.unsubscribe();
    this.authSub.unsubscribe();
  }

  onDeletePost(id: string) {
    this.postService.deletePost(id)
      .subscribe(() => {
        this.postService.getPosts(this.currentPage, this.pageSize);
      });
  }

  onChangePage(event: PageEvent) {
    this.isLoading = true;
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.postService.getPosts(this.currentPage, this.pageSize);
  }

  onLikePost(id: string) {
    this.postService.likePost(id)
      .subscribe(() => {
        this.postService.getPosts(this.pageSize, this.currentPage);
      });
  }

  isPostLiked(postId: string): string {

    if (this.isAuth) {

      let post = this.posts.find(postSearch => postSearch.postId === postId);
      return post.postLikedBy.includes(this.userId) ? 'red' : 'black';
    }
  }
}
