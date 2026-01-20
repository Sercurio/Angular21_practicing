import {CommonModule} from '@angular/common';
import {Component, signal} from '@angular/core';
import {customError, disabled, email, Field, form, hidden, minLength, readonly, required, validate, validateTree} from '@angular/forms/signals';

import {DinnerReview} from './models/dinner-review.model';

@Component({
  selector: 'app-root',
  imports: [CommonModule, Field],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly model = signal<DinnerReview>({
    username: '',
    role: 'user',
    email: '',
    description: '',
    rating: 1,
    recommendation: 'no-opinion',
  });

  readonly reviewForm = form(this.model, path => {
    required(path.username, {
      message: 'Username is required',
    });
    required(path.email, {
      message: 'Email is required',
      when: (ctx) => ctx.valueOf(path.role) !== 'author'
    });
    // email(path.email, {
    //   message: 'Email is not in the correct format',
    // });
    // disabled(path.email, (ctx) => ctx.valueOf(path.role) === 'author');
    hidden(path.email, (ctx) => ctx.valueOf(path.role) === 'author');
    // readonly(path.email, (ctx) => ctx.valueOf(path.role) === 'author');
    validate(path.description, (ctx) => {
      const value = ctx.value();
      const threshold = ctx.valueOf(path.role) === 'author' ? 10 : 5;

      // check that there are at least 10 words
      const wordCount = value.trim().split(/\s+/).length;
      if (wordCount < threshold) {
        return customError({
          kind: 'min-words',
          message: `Description needs to be at least ${
              threshold} words long (currently there are ${wordCount} words)`
        })
      }

      return undefined;
    })
    validateTree(path, (ctx) => {
      const rating = ctx.valueOf(path.rating);
      const recommandation = ctx.valueOf(path.recommendation);

      if (rating < 3 && recommandation === 'recommend') {
        return [
          customError({
            kind: 'rating-conflict',
            message: 'You cannot recommend a meal with a rating below 3',
            field: ctx.field.rating
          }),
          customError({
            kind: 'rating-conflict',
            message: 'You cannot recommend a meal with a rating below 3',
            field: ctx.field.recommendation
          })


        ]
      }
      return undefined;
    });
  })
}
