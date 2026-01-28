import { Component, input, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-control-validation',
  templateUrl: './control-validation.html',
  styleUrl: './control-validation.css',
})
export class ControlValidation implements OnInit {
  control = input<AbstractControl | null>();
  field = input<string>();

  ngOnInit(): void {
    this.control()?.valueChanges.subscribe(() => {
      if (this.control()?.touched) {
        this.control()?.markAsUntouched();
      }
    });
  }
}
