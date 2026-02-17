import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { TfnValidationResponse, ValidationRecord } from '../models/tfn.models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TfnService {
  private readonly apiUrl = environment.apiUrl;
  private historyUpdated = new Subject<void>();
  historyUpdated$ = this.historyUpdated.asObservable();

  constructor(private http: HttpClient) {}

  notifyHistoryUpdate(): void {
    this.historyUpdated.next();
  }

  validate(tfn: string): Observable<TfnValidationResponse> {
    return this.http.post<TfnValidationResponse>(
      `${this.apiUrl}/validate`,
      { tfn }
    );
  }

  getHistory(): Observable<ValidationRecord[]> {
    return this.http.get<ValidationRecord[]>(`${this.apiUrl}/history`);
  }

  clearHistory(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/history`);
  }
}
