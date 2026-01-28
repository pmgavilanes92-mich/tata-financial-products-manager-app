import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.html',
  styleUrl: './confirm-modal.css',
})
export class ConfirmModal {
  message = input<string>();
  confirmMessageBtn = input<string>();
  response = output<boolean>();

  onConfirm(): void {
    this.response.emit(true);
  }

  onCancel(): void {
    this.response.emit(false);
  }
}
