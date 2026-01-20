import {CommonModule} from '@angular/common';
import {Component, inject, signal} from '@angular/core';
import {applyEach, customError, disabled, email, Field, form, max, min, minLength, required, submit, validate, validateTree,} from '@angular/forms/signals';

import {DinnerReview} from './models/dinner-review.model';
import {ReviewsService} from './services/reviews-service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, Field],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly reviewsService = inject(ReviewsService);

  readonly submittedSuccessfully = signal(false);

  readonly model = signal<DinnerReview>({
    username: 'Kobi Hari',
    role: 'user',
    email: 'kobi2294@yahoo.com',
    description: 'The dinner was very nice, we enjoyed it so much',
    reviews:
        [
          {
            aspect: 'Food',
            rating: 4,
            recommendation: 'recommend',
          },
          {
            aspect: 'Service',
            rating: 5,
            recommendation: 'recommend',
          },
        ],
  });

  addReviewItem() {
    this.model.update((state) => ({
                        ...state,
                        reviews: [
                          ...state.reviews, {
                            aspect: '',
                            rating: 0,
                            recommendation: 'no-opinion',
                          }
                        ]
                      }));
  }

  removeReviewItem(index: number) {
    this.model.update(
        (state) =>
            ({...state, reviews: state.reviews.filter((_, i) => i !== index)}));
  }

  onSubmit() {
    console.log('Form submitted');
    submit(this.reviewForm, async form => {
      const res = await this.reviewsService.submitReview(form);
      if (!res) {
        this.submittedSuccessfully.set(true)
      }
      return res;
    });
  }

  readonly reviewForm = form(this.model, path => {
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
    disabled(path, (ctx) => ctx.state.submitting())
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
    applyEach(path.reviews, p => {
      min(p.rating, 1, {message: 'Rating must be at least 1'});
      max(p.rating, 5, {message: 'Rating must be at most 5'});
      required(p.aspect, {message: 'Aspect is required'});
      validateTree(p, (ctx) => {
        if (ctx.valueOf(p.rating) < 3 &&
            ctx.valueOf(p.recommendation) === 'recommend') {
          return [
            customError({
              kind: 'low-rating-recommendation',
              message: 'Low rating with recommendation is not allowed',
              field: ctx.field.rating
            }),
            customError({
              kind: 'low-rating-recommendation',
              message: 'Low rating with recommendation is not allowed',
              field: ctx.field.recommendation
            })
          ];
        }
        return undefined;
      })
    });
  })
}
