import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs'
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Hero} from './hero'
import { HEROES } from './mock-heroes';
import { MessageService } from './message.service'

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  // web API 형식의 URL로 사용
  private heroesUrl = 'api/heroes'

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  /**
   * 
   * @param operation - 실패한 동작의 이름
   * @param result - 기본값으로 반환할 객체
   */
   private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error)

      this.log(`${operation} failed: ${error.message}`)

      return of(result as T)
    }
  }

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  getHeroes(): Observable<Hero[]> {
    // 1) RxJS 'of()'를 사용하는 것
    // TODO: 이 메시지는 서버에서 히어로 정보를 가져온 _후에_ 보내야 합니다.
    // this.messageService.add('HeroService: fetched heroes');
    // return of (HEROES);

    // 2) 서버에서 히어로 목록 가져오는 것
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(_ => this.log(`fetched heroes`)),
        catchError(this.handleError<Hero[]>('getHeroes', []))
      );
  }

  getHero(id: number): Observable<Hero> {
    // 1) RxJS
    // this.messageService.add(`HeroService: fetched hero id=${id}`);
    // return of(HEROES.find(hero => hero.id === id));
    
    // 2) server
    // 해당하는 hero 데이터 가져오기. 없을 경우 404 반환
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    )

  }

  // HeroService에서 보내는 메세지는 MessageService가 화면에 표시
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`)
  }

  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    )
  }

  addHero(hero: Hero): Observable<any> {
    return this.http.post(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`addd hero w/ id=${newHero.id}`)),
      catchError(this.handleError<any>('addHero'))
    )
  }

  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deletedHero'))
    )
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // 입력된 내용이 없다면 빈배열 반환
      return of([])
    }

    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
        this.log(`found heroes matching "${term}"`) : 
        this.log(`no heroes matching "${term}"`)), 
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    )
  }
}
