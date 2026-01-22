import {Component, computed, effect, input, model} from '@angular/core';
import {disabled} from '@angular/forms/signals';

@Component({
  selector: 'app-start-rating',
  imports: [],
  templateUrl: './start-rating.html',
  styleUrl: './start-rating.scss',
  host: {'[class.disabled]': 'disabled()'}
})
export class StartRating {
  readonly value = model.required<number>()
  readonly max = input<number|undefined>()
  readonly stars =
      computed(() => Array.from({length: this.max() || 5}, (_, i) => i + 1))
  readonly disabled = input<boolean>(false)
  readonly readonly = input<boolean>(false)
  setValue(val: number) {
    if (this.disabled() || this.readonly()) return;
    this.value.set(val);
  }
  constructor() {
    effect(() => console.log(this.value()))
  }
}
