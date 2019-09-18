import {Component, Input, OnInit} from '@angular/core';
import {ChipModel} from '../models/post.model';
import {SearchService} from '../services/search.service';

@Component({
  selector: 'app-chip-list',
  templateUrl: './chip-list.component.html',
  styleUrls: ['./chip-list.component.css']
})
export class ChipListComponent implements OnInit {

  @Input() tagList: ChipModel[];

  constructor(private searchService: SearchService) { }

  ngOnInit() {
  }

  onTagSearch(tag: string) {
    this.searchService.searchByTag(tag);
  }
}
