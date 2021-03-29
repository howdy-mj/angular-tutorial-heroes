import { Component, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators'

import { Hero } from '../hero'
import { HeroService } from '../hero.service'

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {
  heroes$: Observable<Hero[]>;
  private searchTerms = new Subject<string>();

  constructor(private heroService: HeroService) { }

  // 사용자가 입력한 검색어를 옵저버블 스트림으로 보냄
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
      debounceTime(300), // 연속된 키 입력 처리는 300ms 대기
      distinctUntilChanged(), // 이전과 입력한 검색어와 같으면 무시
      switchMap((term: string) => this.heroService.searchHeroes(term)) // 검색어 변경 시, 새로운 옵저버블 생성
    )
  }

}
