import { Component, OnInit, OnDestroy } from '@angular/core';
import {PostService} from '../../services/post.service';
import {PostModel} from '../../models/post.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: PostModel[] = [];
  subscription: Subscription;
  constructor(private postService: PostService) { }

  ngOnInit() {
    this.postService.getPosts();
    this.subscription = this.postService.getPostListner()
      .subscribe(posts => {
        this.posts = posts;
        console.log(this.posts);
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
