import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {map, Observable} from "rxjs";
import {Apollo} from "apollo-angular";
import gql from  "graphql-tag"

import { MatCardModule } from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule} from "@angular/forms";

interface Post {
  id: string;
  title: string;
  body: string;
  user: User;
}

interface User {
  id: string;
  username: string;
  email: string;
}

interface MetaData {
  totalCount: number
}

interface PostsData {
  data: Post[],
  meta: MetaData
}

interface Response {
  posts: PostsData
}

const options = {
    "paginate": {
      "page": 1,
      "limit": 5
    }
}
const GET_POSTS = gql`
  query Posts (
    $options: PageQueryOptions
  ) {
    posts(options: $options) {
      data {
        id,
        title,
        body
        user {
          id,
          username,
          email
        }
      }
      meta {
        totalCount
      }
    }
  }
`;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'AngularApollo';
  posts$: Observable<Post[]>;
  newPostForm: FormGroup;

  constructor(private apollo: Apollo, private fb: FormBuilder) {
    this.posts$ = new Observable<Post[]>();
    this.newPostForm = this.fb.group({
      title: new FormControl('', Validators.required),
      body: new FormControl('', Validators.required),
      id: new FormControl('123456', Validators.required)
    })
  }

  ngOnInit(): void {
    this.posts$ = this.apollo.watchQuery<Response>({
      query: GET_POSTS,
      variables: { options }
    }).valueChanges.pipe(map(result => result.data.posts.data));
  }
}
