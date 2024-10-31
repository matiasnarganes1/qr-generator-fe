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
  selectedType = 'Link';
  qrCodeImage: string | null = null;
  qrContent: any = {};

  qrTypes = [
    { value: 'fas fa-link', label: 'Link' },
    { value: 'fas fa-envelope', label: 'Email' },
    { value: 'fas fa-file-alt', label: 'Text' },
    { value: 'fas fa-phone', label: 'Call' },
    { value: 'fas fa-comment', label: 'Sms' },
    { value: 'fab fa-whatsapp', label: 'WhatsApp' }
  ];

  selectOption(value: string) {
    this.selectedType = value;
  }

  generateQRCode() {
    let qrData = '';

    switch (this.selectedType) {
      case 'Link':
        qrData = this.qrContent.url;
        break;
      case 'Email':
        qrData = `mailto:${this.qrContent.to}?subject=${encodeURIComponent(this.qrContent.subject)}&body=${encodeURIComponent(this.qrContent.message)}`;
        break;
      case 'Text':
        qrData = this.qrContent.text;
        break;
      case 'Call':
        qrData = `tel:${this.qrContent.countryCode}${this.qrContent.phoneNumber}`;
        break;
      case 'Sms':
        qrData = `sms:${this.qrContent.countryCode}${this.qrContent.phoneNumber}?body=${encodeURIComponent(this.qrContent.message)}`;
        break;
      case 'WhatsApp':
        qrData = `https://wa.me/${this.qrContent.countryCode}${this.qrContent.phoneNumber}?text=${encodeURIComponent(this.qrContent.message)}`;
        break;
    }

    this.qrCodeImage = `https://localhost:7136/qr-api/QrController/generate?url=${encodeURIComponent(qrData)}&qrType=${this.selectedType}`;
  }

  convertImageToBase64(url: string): Promise<string> {
    return fetch(url)
      .then(response => response.blob())
      .then(blob => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      }));
  }
  
  async downloadQRCode(): Promise<void> {
    if (this.qrCodeImage) {
      const base64Image = await this.convertImageToBase64(this.qrCodeImage);
      const link = document.createElement('a');
      link.href = base64Image;
      link.download = 'qr-code.png';
      link.click();
    }
  }
  
}
