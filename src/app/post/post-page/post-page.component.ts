import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Route} from '@angular/router';
import {PostService} from '../../services/post.service';
import {Subscription} from 'rxjs';
import {PostModel} from '../../models/post.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {response} from 'express';

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.css']
})
export class PostPageComponent implements OnInit, OnDestroy {

  commentSubscription: Subscription;

  isAuth = false;
  currentPost: PostModel;
  commentForm: FormGroup;

  commentValidationMessages = {
    commentAuthor: [
      {type: 'required', message: 'Надо Представиться'}
    ],
    commentText: [
      {type: 'required', message: 'Нужны Ваши Мысли'}
    ]
  };

  constructor(private route: ActivatedRoute,
              private postService: PostService,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.commentForm = this.fb.group({
      author: ['', [Validators.required]],
      text: ['', [Validators.required]]
    });

    this.route.paramMap.subscribe(postId => {

      this.postService.getPost(postId.get('id'));

      this.commentSubscription = this.postService.getPostUpdate()
        .subscribe(post => {
          this.currentPost = post.post;
        });
    });
  }

  get commentAuthor() {
    return this.commentForm.get('author');
  }

  get commentText() {
    return this.commentForm.get('text');
  }

  ngOnDestroy(): void {
    this.commentSubscription.unsubscribe();
  }

  onCreateComment(): void {
    const author = this.commentAuthor.value;
    const text = this.commentText.value;

    console.log(this.commentForm);
    // this.postService.addComment(this.currentPost.postId, author, text)
    //   .subscribe(() => {
    //     this.postService.getPost(this.currentPost.postId);
    // });
    this.commentForm.reset();
  }
}
