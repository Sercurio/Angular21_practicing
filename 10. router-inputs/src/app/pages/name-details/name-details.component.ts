import {Component, computed, input} from '@angular/core';

@Component({
  selector: 'app-name-details',
  standalone: true,
  imports: [],
  templateUrl: './name-details.component.html',
  styleUrl: './name-details.component.scss'
})
export default class NameDetailsComponent {
  // Create a 'name' signal here, which receives the name parameter from the
  // router
  readonly name = input.required<string>();

  // Create a computed signal 'upperCaseName' which returns the name in
  // uppercase
  readonly upperCaseName = computed(() => this.name().toUpperCase());

  // Create a computed signal 'NameLength' which returns the length of the name
  readonly nameLength = computed(() => this.name().length)
}
