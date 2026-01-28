import { Component, input, output } from '@angular/core';
import { PAGINATION_SIZES } from '../../constants/pagination-sizes.constants';

@Component({
  selector: 'app-select-pagination',
  templateUrl: './select-pagination.html',
  styleUrls: ['./select-pagination.css'],
})
export class SelectPagination {
  pages = PAGINATION_SIZES;

  defaultPageSize = input<number>();
  onPageChange = output<number>();

  onPageSizeChange(event: any): void {
    this.onPageChange.emit(event.target.value ?? this.defaultPageSize());
  }
}
