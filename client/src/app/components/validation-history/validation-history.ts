import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TfnService } from '../../services/tfn.service';
import { ValidationRecord } from '../../models/tfn.models';

@Component({
  selector: 'app-validation-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './validation-history.html',
  styleUrls: ['./validation-history.scss']
})
export class ValidationHistoryComponent implements OnInit, OnDestroy {
  records: ValidationRecord[] = [];
  private sub!: Subscription;

  constructor(private tfnService: TfnService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadHistory();
    this.sub = this.tfnService.historyUpdated$.subscribe(() => this.loadHistory());
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  loadHistory(): void {
    this.tfnService.getHistory().subscribe({
      next: (data) => { this.records = data; this.cdr.detectChanges(); },
      error: () => { this.records = []; this.cdr.detectChanges(); }
    });
  }

  clearHistory(): void {
    this.tfnService.clearHistory().subscribe({
      next: () => { this.records = []; this.cdr.detectChanges(); }
    });
  }
}
