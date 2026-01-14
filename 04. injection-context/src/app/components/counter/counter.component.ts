import {Component, DestroyRef, effect, EffectRef, inject, Injector, signal} from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  imports: [],
  templateUrl: './counter.component.html',
  styleUrl: './counter.component.scss'
})
export class CounterComponent {
  readonly counter = signal(0);

  readonly dr = inject(DestroyRef);
  readonly injector = inject(Injector);
  er: EffectRef|null = null

  constructor() {
    const int = setInterval(() => {
      this.counter.update(v => v + 1);
    }, 1000);

    this.dr.onDestroy(() => clearInterval(int));
  }

  startEffect() {
    this.er = effect(() => {
      console.log(this.counter());
    }, {injector: this.injector});
  }

  stopEffect() {
    this.er?.destroy();
    this.er = null;
  }
}
