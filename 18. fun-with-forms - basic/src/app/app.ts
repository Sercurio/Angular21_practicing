import {CommonModule} from '@angular/common';
import {Component, signal} from '@angular/core';
import {email, Field, form, minLength, required, validate, validateTree} from '@angular/forms/signals';

import {DinnerReview} from './models/dinner-review.model';

@Component({
  selector: 'app-root',
  imports: [CommonModule, Field],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  standalone: true
})
export class App {
  readonly model = signal<DinnerReview>({
    username: '',
    role: 'user',
    email: '',
    description: '',
    rating: 1,
  })

  readonly reviewModel = form(this.model, (path) => {
    required(path.username, {message: 'Username is required'});
    required(path.email, {
      message: 'Email is required',
      when: (ctx) => ctx.valueOf(path.role) !== 'author'
    });
    email(path.email, {
      message: 'Email is invalid',

    });
    validate(path.description, (ctx) => {
      const wordCount = ctx.value().split(' ').length;
      const threshold = ctx.valueOf(path.role) === 'author' ? 10 : 5;
      if (wordCount < threshold) {
        return {
          kind: 'min-words',
          message:
              `Description must be at least ${threshold} words (${wordCount})`
        };
      }
      return undefined;
    })
  })
}
