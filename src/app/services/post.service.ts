import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ChipModel, PostModel} from '../models/post.model';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  postChanged = new Subject<{ posts: PostModel[], postCount: number }>();
  userPostsChanged = new Subject<{posts: any, count: number}>();
  postUpdate = new Subject<{ post: PostModel }>();

  private posts: PostModel[];
  private post: PostModel;
  private userPosts: any[];

  constructor(private http: HttpClient,
              private router: Router) {
  }

  getPosts(pageSize: number, currentPage: number) {
    const queryParam = `?pageSize=${pageSize}&page=${currentPage}`;

    this.http.get<{ message: string, posts: any, maxPosts: number }>('http://localhost:4000/api/posts/' + queryParam)
      .pipe(
        map(postData => {
          return {
            posts: postData.posts.map(post => {
              return {
                postId: post._id,
                postTitle: post.postTitle,
                postAuthor: post.postAuthor,
                authorId: post.authorId,
                postTags: post.postTags,
                postText: post.postText,
                postDate: post.postDate,
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
    this.http.get<{
      objectID: string,
      postTitle: string,
      postAuthor: string,
      authorId: string,
      postTags: [],
      postText: string,
      postDate: Date,
      postLikeCounter: number,
      postLikedBy: string[],
      postComments: []
    }>('http://localhost:4000/api/posts/' + id)
      .pipe(
        map(post => {
          return {
            postId: post.objectID,
            postTitle: post.postTitle,
            postAuthor: post.postAuthor,
            authorId: post.authorId,
            postTags: post.postTags,
            postText: post.postText,
            postDate: post.postDate,
            postLikeCounter: post.postLikeCounter,
            postLikedBy: post.postLikedBy,
            postComments: post.postComments
          };
        })
      ).subscribe(post => {
        console.log('post request', post);
        this.post = post;
        this.postUpdate.next({
          post: this.post
        });
      });
  }

  getUserPosts(pageSize: number, currentPage: number) {
    const queryParam = `?pageSize=${pageSize}&page=${currentPage}`;

    this.http.get<{ posts: any, count: number }>('http://localhost:4000/api/posts/userPosts' + queryParam)
      .pipe(
        map(posts => {
          return {
            posts: posts.posts.map(post => {
              return {
                postId: post.objectID,
                postTitle: post.postTitle,
                postText: post.postText,
                postDate: post.postDate
              };
            }),
            count: posts.count
          };
        })
      ).subscribe(data => {
        this.userPosts = data.posts;
        this.userPostsChanged.next({
          posts: [...this.userPosts],
          count: data.count
        });
      });
  }

  getPostListner() {
    return this.postChanged.asObservable();
  }

  getPostUpdate() {
    return this.postUpdate.asObservable();
  }

  getUserPostsListner() {
    return this.userPostsChanged.asObservable();
  }

  addPost(postTitle: string, postAuthor: string, postTags: ChipModel[], postText: string) {
    const postDate = new Date();
    const post = {postTitle, postAuthor, postTags, postText, postDate};

    // Данные об авторе поста будут переданы в хедаре, в токене авторизованного пользователя в auth-interception
    this.http.post<{ message: string }>('http://localhost:4000/api/posts/', post)
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }

  updatePost(
    postId: string,
    postTitle: string,
    postTags: ChipModel[],
    postText: string) {

    const id = postId;
    const postDate = new Date();
    const post = {postTitle, postTags, postText, postDate};

    this.http.put<{message: string}>('http://localhost:4000/api/posts/edit/' + id, post)
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
