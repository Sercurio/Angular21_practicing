import {Component, computed, contentChild, input} from '@angular/core';
import {Field} from '@angular/forms/signals';

@Component({
  selector: 'app-field',
  imports: [],
  templateUrl: './field-wrapper.html',
  styleUrl: './field-wrapper.scss',
})
export class FieldWrapper {
  readonly label = input('')
  readonly fieldDirective = contentChild.required(Field)
  readonly field = computed(() => this.fieldDirective().state())
  readonly errors = computed(() => this.field().errors())
  readonly required = computed(() => this.field().required())
}
