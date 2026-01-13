import {CommonModule} from '@angular/common';
import {Component, computed, effect, signal} from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'

})
export class AppComponent {
  readonly firstNumber = signal(0);
  readonly secondNumber = signal(0);

  readonly sum = computed(() => this.firstNumber() + this.secondNumber());

  setSecondSignalTo10() {
    this.secondNumber.set(10);
  }

  incrementFirstSignal() {
    if (this.firstNumber() < 10) {
      this.firstNumber.update(value => value + 1);
    }
  }

  incrementBothSignals() {
    if (this.firstNumber() < 10) {
      this.firstNumber.update(value => value + 1);
    }
    if (this.secondNumber() < 10) {
      this.secondNumber.update(value => value + 1);
    }
  }


  constructor() {
    effect(() => {
      console.log('FirstSignal: ', this.firstNumber());
      console.log('SecondSignal: ', this.secondNumber());
    });
  }
}
