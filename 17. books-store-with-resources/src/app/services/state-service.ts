import {HttpClient, httpResource} from '@angular/common/http';
import {inject, Injectable, linkedSignal, resource, ResourceStreamItem, signal} from '@angular/core';
import {rxResource} from '@angular/core/rxjs-interop';
import {map, of} from 'rxjs';

import {Book} from '../models/book';
import {webSocketObservable} from '../tools/web-socket-observable';

@Injectable({providedIn: 'root'})
export class StateService {
  readonly baseApi = 'http://localhost:3000/api/books'
  readonly wsApi = 'ws://localhost:3000/ws'
  readonly http = inject(HttpClient)
  readonly #keyword = signal<string>('')
  // readonly #searchResult = resource({
  //   params: () => ({keyword: this.#keyword()}),
  //   defaultValue: [],
  //   loader: (options) =>
  //       this.#searchKeywordPromise(options.params.keyword,
  //       options.abortSignal)
  // })
  readonly #searchResult = httpResource<Book[]>(
      () => ({url: `${this.baseApi}/search`, params: {q: this.#keyword()}}),
      {defaultValue: []})
  readonly #selectedBookId = linkedSignal<Book[], string>({
    source: () => this.searchResult.value(),
    computation:
        (src, prev) => {
          if (!prev) return src.length > 0 ? src[0]?.id : '';
          if (prev.value === '' && src.length > 0) return src[0]?.id;
          return prev.value;
        }
  })
  readonly #selectedBook = rxResource({
    params: () => ({id: this.selectedBookId()}),
    stream: (options) => options.params.id ?
        this.http.get<Book>(`${this.baseApi}/${options.params.id}`) :
        of(null),
    defaultValue: null
  })

  // readonly #selectedStock = resource({
  //   params: () => ({id: this.selectedBookId()}),
  //   stream:
  //       async (options) => {
  //         const res = signal<ResourceStreamItem<number>>({value: 0});
  //         if (options.params.id) {
  //           const ws = new
  //           WebSocket(`${this.wsApi}/stock/${options.params.id}`)
  //           ws.onmessage = (event) => {
  //             const data = JSON.parse(event.data)
  //             if (data.stock !== undefined) {
  //               res.set({value: data.stock})
  //             }
  //           };
  //           options.abortSignal.addEventListener('abort', () => ws.close())
  //         }

  //         return res;
  //       }
  // })

  readonly #selectedStock = rxResource({
    params: () => ({id: this.#selectedBookId()}),
    stream:
        (options) => {
          if (!options.params.id) return of(null);

          return webSocketObservable<{stock: number}>(
                     `${this.wsApi}/stock/${options.params.id}`)
              .pipe(map(data => data.stock));
        }
  })

  get keyword() {
    return this.#keyword.asReadonly()
  }
  setKeyword(value: string) {
    this.#keyword.set(value)
  }

  get searchResult() {
    return this.#searchResult.asReadonly()
  }

  get selectedBookId() {
    return this.#selectedBookId.asReadonly()
  }

  setSelectedBookId(value: string) {
    this.#selectedBookId.set(value)
  }

  get selectedBook() {
    return this.#selectedBook.asReadonly()
  }

  get selectedStock() {
    return this.#selectedStock.asReadonly()
  }

  // async #searchKeywordPromise(value: string, abortSignal: AbortSignal):
  //     Promise<Book[]>{return fetch(`${this.baseApi}/search?q=${value}`, {
  //                              signal: abortSignal
  //                            })
  //                         .then(res => res.json())}

  constructor() {}
}
