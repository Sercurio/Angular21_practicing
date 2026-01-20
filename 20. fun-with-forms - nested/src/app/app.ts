import {CommonModule} from '@angular/common';
import {Component, signal} from '@angular/core';
import {customError, email, Field, form, max, minLength, required, validate,} from '@angular/forms/signals';

import {DinnerReview} from './models/dinner-review.model';

@Component({
  selector: 'app-root',
  imports: [CommonModule, Field],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly model = signal<DinnerReview>({
    username: 'Kobi Hari',
    role: 'user',
    email: 'kobi2294@yahoo.com',
    description: 'The dinner was very nice, we enjoyed it so much',
    food: {
      rating: 1,
      recommendation: 'no-opinion',
    },
    service: {rating: 1, recommendation: 'no-opinion'}
  });

  readonly reviewForm = form(this.model, (path) => {
    required(path.username, {
      message: 'Username is required',
    });
    required(path.email, {
      message: 'Email is required',
      when: (ctx) => ctx.valueOf(path.role) !== 'author',
    });
    email(path.email, {
      message: 'Email is not in the correct format',
    });
    validate(path.description, (ctx) => {
      const value = ctx.value();
      const threshold = ctx.valueOf(path.role) === 'author' ? 10 : 5;

      // check that there are at least 10 words
      const wordCount = value.trim().split(/\s+/).length;
      if (wordCount < threshold) {
        return customError({
          kind: 'min-words',
          message: `Description needs to be at least ${
              threshold} words long (currently there are ${wordCount} words)`,
        });
      }

      return undefined;
    });

    max(path.food.rating, 5, {
      message: 'Food rating must be between 1 and 5',
    });
    max(path.service.rating, 5, {
      message: 'Service rating must be between 1 and 5',
    });
  });
}
