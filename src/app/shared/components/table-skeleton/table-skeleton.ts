import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-table-skeleton',
  templateUrl: './table-skeleton.html',
  styleUrls: ['./table-skeleton.css'],
})
export class TableSkeleton {
  cols = input<number>(5);
  rows = input<number>(5);

  private readonly widths = ['85%', '70%', '95%', '60%'];
  protected rowsArray = computed(() => Array(this.rows()));
  protected colsArray = computed(() => Array(this.cols()));

  getRandomWidth = (index: number): string => this.widths[index % this.widths.length];
}
