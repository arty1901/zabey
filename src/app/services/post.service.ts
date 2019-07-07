import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ChipModel, PostModel} from '../models/post.model';
import {Router} from '@angular/router';
import {pipe, Subject} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  postChanged = new Subject<{posts: PostModel[], postCount: number}>();
  postUpdate = new Subject<{post: PostModel}>();
  private posts: PostModel[];
  private post: PostModel;
  constructor(private http: HttpClient,
              private router: Router) {
  }

  getPosts(pageSize: number, currentPage: number) {
    const queryParam = `?pageSize=${pageSize}&page=${currentPage}`;

    return this.http.get<{ message: string, posts: any, maxPosts: number }>('http://localhost:4000/api/posts/' + queryParam)
      .pipe(
        map(postData => {
          return {
            posts: postData.posts.map(post => {
              return {
                postId: post._id,
                postTitle: post.postTitle,
                postAuthor: post.postAuthor,
                postTags: post.postTags,
                postText: post.postText,
                postDate: post.postDate,
                postCreator: post.postCreator,
                postLikeCounter: post.postLikeCounter,
                postLikedBy: post.postLikedBy,
                postComments: post.postComments
              };
            }),
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(
        (response) => {
          this.posts = response.posts;
          this.postChanged.next({
            posts: [...this.posts],
            postCount: response.maxPosts
          });
        }
      );
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string,
      postTitle: string,
      postAuthor: string,
      postTags: [],
      postText: string,
      postDate: Date,
      postCreator: string,
      postLikeCounter: number,
      postLikedBy: string[],
      postComments: []
    }>('http://localhost:4000/api/posts/' + id)
      .pipe(
        map(post => {
          return {
            postId: post._id,
            postTitle: post.postTitle,
            postAuthor: post.postAuthor,
            postTags: post.postTags,
            postText: post.postText,
            postDate: post.postDate,
            postCreator: post.postCreator,
            postLikeCounter: post.postLikeCounter,
            postLikedBy: post.postLikedBy,
            postComments: post.postComments
          };
        })
      ).subscribe(post => {
        this.post = post;
        this.postUpdate.next({
          post: this.post
        });
      });
  }

  getPostListner() {
    return this.postChanged.asObservable();
  }

  getPostUpdate() {
    return this.postUpdate.asObservable();
  }

  addPost(postTitle: string, postAuthor: string, postTags: ChipModel[], postText: string) {
    const postDate = new Date();
    const post = { postTitle, postAuthor, postTags, postText, postDate };

    // Данные об авторе поста будут переданы в хедаре, в токене авторизованного пользователя в auth-interception
    this.http.post<{message: string}>('http://localhost:4000/api/posts/', post)
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }

  updatePost(postId: string, postTitle: string, postAuthor: string, postTags: ChipModel[], postText: string) {
    const id = postId;
    const postDate = new Date();
    const post = {postId, postTitle, postAuthor, postTags, postText, postDate};

    this.http.put('http://localhost:4000/api/posts/edit/' + id, post)
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }

  deletePost(id: string) {
    return this.http.delete('http://localhost:4000/api/posts/' + id);
  }

  addComment(id: string, author: string, text: string) {
    const comment = {id, author, text};

    return this.http.post('http://localhost:4000/api/posts/comment', comment);
  }

  likePost(id: string) {

    return this.http.put('http://localhost:4000/api/posts/likePost', {id});
  }
}
