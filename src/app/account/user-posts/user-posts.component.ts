import { Component, OnInit } from '@angular/core';
import {PostService} from '../../services/post.service';

@Component({
  selector: 'app-user-posts',
  templateUrl: './user-posts.component.html',
  styleUrls: ['./user-posts.component.css']
})
export class UserPostsComponent implements OnInit {

  constructor(private postService: PostService) { }

  ngOnInit() {
  }

}
