import { Component, Input } from '@angular/core';

@Component({
  selector: 'cn-button',
  templateUrl: './cn-button.component.html'
})
export class CNButtonComponent {
  @Input()
  label: string | number;
  @Input()
  disabled: boolean;
  @Input()
  outline: boolean;

  focused: boolean;

  constructor() {}
}
