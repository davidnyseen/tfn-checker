import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TfnService } from '../../services/tfn.service';
import { TfnValidationResponse } from '../../models/tfn.models';

@Component({
  selector: 'app-tfn-checker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tfn-checker.html',
  styleUrls: ['./tfn-checker.scss']
})
export class TfnCheckerComponent {
  tfnInput = '';
  result: TfnValidationResponse | null = null;
  loading = false;
  error = '';

  constructor(private tfnService: TfnService, private cdr: ChangeDetectorRef) {}

  formatTfn(): void {
    const digits = this.tfnInput.replace(/\D/g, '').slice(0, 9);
    const parts = [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 9)];
    this.tfnInput = parts.filter(p => p).join(' ');
  }

  validate(): void {
    this.loading = true;
    this.error = '';
    this.result = null;

    this.tfnService.validate(this.tfnInput).subscribe({
      next: (res) => {
        this.result = res;
        this.loading = false;
        this.tfnService.notifyHistoryUpdate();
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Failed to connect to the API.';
        this.loading = false;
      }
    });
  }
}
