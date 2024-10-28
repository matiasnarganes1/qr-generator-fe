import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-qr-generator',
  templateUrl: './qr-generator.component.html',
  imports: [FormsModule, CommonModule],
  styleUrls: ['./qr-generator.component.sass']
})

export class QrGeneratorComponent {
  selectedType = 'link';
  qrCodeImage: string | null = null;
  qrContent: any = {}; // Este objeto almacenará los datos de cada tipo de QR

  qrTypes = [
    { value: 'link', label: 'Link' },
    { value: 'email', label: 'Email' },
    { value: 'text', label: 'Text' },
    { value: 'call', label: 'Call' },
    { value: 'sms', label: 'SMS' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'wifi', label: 'Wi-Fi' },
  ];

  onTypeChange() {
    this.qrContent = {}; // Restablecer el contenido cuando se cambia el tipo
  }

  generateQRCode() {
    // Genera la URL del código QR usando los datos de qrContent
    let qrData = '';

    switch (this.selectedType) {
      case 'link':
        qrData = this.qrContent.url;
        break;
      case 'email':
        qrData = `mailto:${this.qrContent.to}?subject=${encodeURIComponent(this.qrContent.subject)}&body=${encodeURIComponent(this.qrContent.message)}`;
        break;
      case 'text':
        qrData = this.qrContent.text;
        break;
      case 'call':
        qrData = `tel:${this.qrContent.countryCode}${this.qrContent.phoneNumber}`;
        break;
      case 'sms':
        qrData = `sms:${this.qrContent.countryCode}${this.qrContent.phoneNumber}?body=${encodeURIComponent(this.qrContent.message)}`;
        break;
      case 'whatsapp':
        qrData = `https://wa.me/${this.qrContent.countryCode}${this.qrContent.phoneNumber}?text=${encodeURIComponent(this.qrContent.message)}`;
        break;
      case 'wifi':
        qrData = `WIFI:S:${this.qrContent.ssid};T:${this.qrContent.type};P:${this.qrContent.password};H:${this.qrContent.hidden};`;
        break;
    }

    this.qrCodeImage = `https://localhost:7136/qr-api/QrController/generate?url=${encodeURIComponent(qrData)}&qrType=${this.selectedType}`;
  }
}
