import {CommonModule} from '@angular/common';
import {Component, signal} from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  readonly names = signal(['Alice', 'Bob', 'Charlie']);
  readonly person = signal({name: 'Alice', age: 30});

  constructor() {
    setTimeout(() => {
      this.names.update((names) => [...names, 'Godric']);
    }, 1000);

    setTimeout(() => {
      this.person.update((person) => ({...person, name: 'Godric'}));
    }, 2000);

    setTimeout(() => {
      this.names.update((names) => names.map(name => name.toUpperCase()));
    }, 3000);

    setTimeout(() => {
      this.names.update((names) => names.filter(name => !name.startsWith('B')));
    }, 4000);
  }
}
