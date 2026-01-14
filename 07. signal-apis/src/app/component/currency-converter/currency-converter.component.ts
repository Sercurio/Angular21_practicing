import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';

import {RATES} from './rates';

@Component({
  selector: 'app-currency-converter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './currency-converter.component.html',
  styleUrl: './currency-converter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrencyConverterComponent {
  readonly amount = input.required<number>()
  readonly currency = input.required<string>()

  readonly rate = computed(() => {
    return RATES[this.currency()];
  })

  readonly converted = computed(() => {
    return this.amount() * this.rate();
  })
}
