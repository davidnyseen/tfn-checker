import { Component } from '@angular/core';
import { TfnCheckerComponent } from './components/tfn-checker/tfn-checker';
import { ValidationHistoryComponent } from './components/validation-history/validation-history';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TfnCheckerComponent, ValidationHistoryComponent],
  template: `
    <div class="app-container">
      <h1>TFN Checker</h1>
      <p>Australian Tax File Number Validator</p>
      <app-tfn-checker></app-tfn-checker>
      <app-validation-history></app-validation-history>
    </div>
  `,
  styles: [`
    .app-container {
      max-width: 600px;
      margin: 2rem auto;
      padding: 0 1rem;
    }
  `]
})
export class App {}
