import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs'

import { Hero} from './hero'
import { HEROES } from './mock-heroes';
import { MessageService } from './message.service'

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  constructor(private messageService: MessageService) { }

  getHeroes(): Observable<Hero[]> {
    // TODO: messages는 히어로 데이터를 가져온 후 보내야 함
    this.messageService.add('HeroService: fetched heroes')
    return of (HEROES);
  }
}
