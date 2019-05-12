import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material';
import {PostService} from '../../services/post.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {ChipModel, PostModel} from '../../models/post.model';
import {ChipsValidation} from '../ChipsValidation';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  private mode = 'create';
  private postId: string;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  tagsList: ChipModel[] = [];
  form: FormGroup;
  post: PostModel;
  isLoading = false;

  constructor(private postService: PostService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    // Form init
    this.form = new FormGroup({
      postTitle: new FormControl('', { validators: [Validators.required, Validators.minLength(4)] }),
      postAuthor: new FormControl('', { validators: [Validators.required] }),
      postText: new FormControl('', { validators: [Validators.required] }),
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {

      if (paramMap.has('id')) {

        this.mode = 'edit';
        this.postId = paramMap.get('id');
        this.isLoading = true;

        this.postService.getPost(this.postId)
          .subscribe((post) => {
            // Fetched post with specified id
            this.post = {
              postId: post._id,
              postTitle: post.postTitle,
              postAuthor: post.postAuthor,
              postTags: post.postTags,
              postText: post.postText,
              postDate: null
            };

            // Preload a form with a fetched data
            this.form.setValue({
              postTitle: this.post.postTitle,
              postAuthor: this.post.postAuthor,
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

  get postTitle() { return this.form.get('postTitle'); }
  get postAuthor() { return this.form.get('postAuthor'); }
  get postText() { return this.form.get('postText'); }

  getPostTitleError() {
    return this.postTitle.hasError('required') ? 'Нужно назвать твою историю' :
      this.postTitle.hasError('minlength') ? 'Название не может быть короче 4 символов' :
        '';
  }

  getPostAuthorError() {
    return this.postAuthor.hasError('required') ? 'Тебе надо представиться' : '';
  }

  getPostTextError() {
    return this.postText.hasError('required') ? 'О чем твоя история?' : '';
  }

  onCreatePost() {
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postService.addPost(this.postTitle.value, this.postAuthor.value, this.tagsList, this.postText.value);
    } else {
      this.postService.updatePost(this.post.postId, this.postTitle.value, this.postAuthor.value, this.tagsList, this.postText.value);
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
