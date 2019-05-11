import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PostModel} from '../models/post.model';
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

  addPost(postTitle: string, postAuthor: string, postTags: [], postText: string) {
    const postDate = new Date();
    const post = {
      postTitle,
      postAuthor,
      postTags,
      postText,
      postDate
    };

    this.http.post<{message: string}>('http://localhost:4000/api/posts/', post)
      .subscribe(response => {
        this.router.navigate(['/']);
      });
  }
}
