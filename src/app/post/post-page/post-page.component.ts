import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Route} from '@angular/router';
import {PostService} from '../../services/post.service';
import {Subscription} from 'rxjs';
import {PostModel} from '../../models/post.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.css']
})
export class PostPageComponent implements OnInit, OnDestroy {

  commentSubscription: Subscription;

  author = '';
  currentPost: PostModel;
  commentForm: FormGroup;
  isLoadingPost = true;
  isLoadingComments = true;

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
              private authService: AuthService,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    if (this.authService.getAuthUser().isAuth) { this.author = this.authService.getAuthUser().username; }
    this.commentForm = this.fb.group({
      author: [this.author, [Validators.required]],
      text: ['', [Validators.required]]
    });

    this.route.paramMap.subscribe(postId => {

      this.postService.getPost(postId.get('id'));

      this.updateState();
      this.isLoadingPost = false;
      console.log(this.isLoadingPost);
    });

    this.updateState();
    this.isLoadingComments = false;
    console.log(this.isLoadingComments);
  }

  get commentAuthor() {
    return this.commentForm.get('author');
  }

  get commentText() {
    return this.commentForm.get('text');
  }

  updateState(): void {
    this.commentSubscription = this.postService.getPostUpdate()
      .subscribe(post => {
        this.currentPost = post.post;
      });
  }

  ngOnDestroy(): void {
    this.commentSubscription.unsubscribe();
  }

  onCreateComment(): void {
    const author = this.commentAuthor.value;
    const text = this.commentText.value;
    this.isLoadingComments = true;

    this.postService.addComment(this.currentPost.postId, author, text)
      .subscribe(() => {
        this.postService.getPost(this.currentPost.postId);
    });
    this.commentForm.reset();
  }
}
