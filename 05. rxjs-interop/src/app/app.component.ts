import {CommonModule} from '@angular/common';
import {Component, OnInit, signal} from '@angular/core';
import {toObservable, toSignal} from '@angular/core/rxjs-interop';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  readonly number$ = new Observable((observer) => {
    setInterval(() => {
      observer.next(Math.random());
    }, 1000);
  })
  readonly number = toSignal(this.number$);

  readonly myName = signal('John Doe');
  readonly myName$ = toObservable(this.myName);

  constructor() {
    this.myName$.subscribe(name => console.log(name));
  }

  readonly number2$ = new Observable((observer) => {
    setInterval(() => {
      observer.next(Math.random());
    }, 1000);
  })

  ngOnInit() {
    const number2 = toSignal(this.number2$);
  }
}
