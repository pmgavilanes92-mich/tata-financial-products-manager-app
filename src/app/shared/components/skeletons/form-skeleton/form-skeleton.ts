import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-form-skeleton',
  imports: [],
  templateUrl: './form-skeleton.html',
  styleUrl: './form-skeleton.css',
})
export class FormSkeleton {
  numberLabel = input<number>(6);
  protected labelsArray = computed(() => Array(this.numberLabel()));
}
