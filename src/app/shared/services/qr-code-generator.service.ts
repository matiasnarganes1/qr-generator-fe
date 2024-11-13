import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class QrCodeGeneratorService {
  private baseUrl = 'https://localhost:7136/qr-api/QrController/generate?url=';

  constructor(private http: HttpClient) { }

  getQrCode(qrData: string, selectedType: string): Observable<string> {
    return this.http.get(`${this.baseUrl}${encodeURIComponent(qrData)}&qrType=${selectedType}`, { responseType: 'blob' })
      .pipe(
        map((blob: Blob) => URL.createObjectURL(blob))
      );
  }
  
}
