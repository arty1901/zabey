import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  searchChanged = new Subject<{data: any}>();

  private searchResult: [];

  constructor(private http: HttpClient) { }

  searchByTag(tag: string) {
    const query = `?request=${tag}`;

    return this.http.get<{data: any}>('http://localhost:4000/api/search/tag/' + query)
      .pipe(map(elements => {

        return {
          data: elements.data.map(el => {

            return {
              id: el._id,
              title: el.postTitle,
              text: el.postText,
              author: el.postAuthor,
              likesCounter: el.postLikeCounter
            };
          })
        };
      }))
      .subscribe(data => {

        this.searchResult = data.data;
        this.searchChanged.next({
          data: [...this.searchResult]
        });
      });
  }

  searchByForm(q: string) {
    const query = `?q=${q}`;

    return this.http.get<{result: any}>('http://localhost:4000/api/search/query/' + query)
      .pipe(map(element => {
        return {
          result: element.result.map(el => {
            return {
              id: el._id,
              title: el.postTitle,
              text: el.postText,
              author: el.postAuthor,
              likesCounter: el.postLikeCounter
            };
          })
        };
      }))
      .subscribe(result => {
        this.searchResult = result.result;
        this.searchChanged.next({
          data: [...this.searchResult]
        });
      });
  }

  getSearchResultListner() {
    return this.searchChanged.asObservable();
  }

  getSearchResult() {
    return this.searchResult;
  }
}
