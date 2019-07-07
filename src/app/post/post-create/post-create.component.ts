import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material';
import {PostService} from '../../services/post.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {ChipModel, PostModel} from '../../models/post.model';
import {AuthService} from '../../services/auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, OnDestroy {

  private mode = 'create';
  private postId: string;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER];
  tagsList: ChipModel[] = [];
  form: FormGroup;
  post: PostModel;
  isLoading = false;
  postSubscription: Subscription;

  postValidationMessages = {
    postTitle: [
      {type: 'required', message: 'Post Title is required'}
    ],
    postText: [
      {type: 'required', message: 'Post text is required'}
    ]
  };

  constructor(private postService: PostService,
              private route: ActivatedRoute,
              private authService: AuthService) {
  }

  ngOnInit() {
    // Form init
    this.form = new FormGroup({
      postTitle: new FormControl('', {validators: [Validators.required, Validators.minLength(4)]}),
      postText: new FormControl('', {validators: [Validators.required]}),
    });
    // в завимисомсти от запроса, если есть параметр id, то переходим в режим редактирования
    // иначе режим создания
    this.route.paramMap.subscribe((paramMap: ParamMap) => {

      if (paramMap.has('id')) {

        this.mode = 'edit';
        this.postId = paramMap.get('id');
        this.isLoading = true;

        this.postService.getPost(this.postId);

        this.postSubscription = this.postService.getPostUpdate()
          .subscribe(post => {
            this.post = post.post;

            // Preload a form with a fetched data
            this.form.setValue({
              postTitle: this.post.postTitle,
              postText: this.post.postText
            });

            this.tagsList = this.post.postTags;

            this.isLoading = false;
          });
      } else {

        this.mode = 'create';
        this.tagsList = [];
        this.form.reset();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.postSubscription) {
      this.postSubscription.unsubscribe();
    }
  }

  get postTitle() {
    return this.form.get('postTitle');
  }

  get postText() {
    return this.form.get('postText');
  }

  onCreatePost() {
    const postCreator = this.authService.getAuthUser().username;
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postService.addPost(this.postTitle.value, postCreator, this.tagsList, this.postText.value);
    } else {
      this.postService.updatePost(this.post.postId, postCreator, this.postTitle.value, this.tagsList, this.postText.value);
    }
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our tag
    if ((value || '').trim()) {
      this.tagsList.push({name: value.trim()});
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(tag): void {
    const index = this.tagsList.indexOf(tag);

    if (index >= 0) {
      this.tagsList.splice(index, 1);
    }
  }
}
