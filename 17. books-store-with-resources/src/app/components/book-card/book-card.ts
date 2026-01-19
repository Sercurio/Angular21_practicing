import {Component, inject, input, signal} from '@angular/core';

import {Book} from '../../models/book';
import {StateService} from '../../services/state-service';
import {Busy} from '../busy/busy';

@Component({
  selector: 'app-book-card',
  imports: [Busy],
  templateUrl: './book-card.html',
  styleUrl: './book-card.scss'
})
export class BookCard {
  readonly state = inject(StateService)

  readonly stock = signal(43);
}
