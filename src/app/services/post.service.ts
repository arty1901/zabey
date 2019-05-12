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

  postChanged = new Subject<PostModel[]>();
  private posts: PostModel[] = [];
  constructor(private http: HttpClient,
              private router: Router) {
  }

  getPosts() {
    return this.http.get<{ message: string, posts: any }>('http://localhost:4000/api/posts/')
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
                postDate: post.postDate
              };
            })
          };
        })
      )
      .subscribe(
        (response) => {
          this.posts = response.posts;
          this.postChanged.next([...this.posts]);
        }
      );
  }

  getPost(id: string) {
    console.log(id);
    return this.http.get<{
      _id: string,
      postTitle: string,
      postAuthor: string,
      postTags: [],
      postText: string,
      postDate: Date
    }>('http://localhost:4000/api/posts/' + id);
  }

  getPostListner() {
    return this.postChanged.asObservable();
  }

  addPost(postTitle: string, postAuthor: string, postTags: ChipModel[], postText: string) {
    const postDate = new Date();
    const post = { postTitle, postAuthor, postTags, postText, postDate };

    this.http.post<{message: string}>('http://localhost:4000/api/posts/', post)
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }

  updatePost(postId: string, postTitle: string, postAuthor: string, postTags: ChipModel[], postText: string) {
    const id = postId;
    const postDate = new Date();
    const post = {postId, postTitle, postAuthor, postTags, postText, postDate};

    this.http.put('http://localhost:4000/api/posts/' + id, post)
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }

  deletePost(id: string) {
    return this.http.delete('http://localhost:4000/api/posts/' + id);
  }
}
