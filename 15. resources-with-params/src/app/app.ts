import {Component, inject, resource, signal} from '@angular/core';

import {Numeric} from './components/numeric/numeric';
import {Api} from './services/api';

@Component({
  selector: 'app-root',
  imports: [Numeric],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  standalone: true,
})
export class App {
  readonly api = inject(Api);
  readonly source = signal(50);

  readonly apiNumber = resource({
    params: () => ({value: this.source()}),
    loader: (options) =>
        this.api.mutiplyByFiveAsync(options.params.value, options.abortSignal),
    defaultValue: -1
  });

  reloadNumber() {
    this.apiNumber.reload();
  }

  setLocalValue(val: number) {
    this.apiNumber.set(val);
  }

  constructor() {}
}
