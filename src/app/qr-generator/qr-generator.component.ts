import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Qr_Types } from '../shared/constants';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { CallFields } from '../shared/models/call-fields';
import { EmailFields } from '../shared/models/email-fields';
import { LinkFields } from '../shared/models/link-fields';
import { SmsFields } from '../shared/models/sms-fields';
import { TextFields } from '../shared/models/text-fields';
import { WhatsappFields } from '../shared/models/whatsapp-fields';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { QrCodeGeneratorService } from '../shared/services/qr-code-generator.service';

@Component({
  standalone: true,
  selector: 'app-qr-generator',
  templateUrl: './qr-generator.component.html',
  imports: [FormsModule, CommonModule, TranslateModule],
  styleUrls: ['./qr-generator.component.sass']
})

export class QrGeneratorComponent implements OnInit {
  qrCodeImage: string = '';
  selectedType: string = '';
  qrContent: any = {}
  qrTypes: any = [];

  constructor(private translate: TranslateService, private qrCodeGeneratorService: QrCodeGeneratorService) {
    this.translate.setDefaultLang('en');
  }

  ngOnInit(): void {
    this.selectedType = 'firstLink';
    this.qrTypes = Qr_Types;
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
  }

  async selectOption(type: string) {
    if (this.selectedType && this.selectedType !== type && this.hasAnyFieldWithValue(this.selectedType)) {
      const result = await this.triggerConfirm()
      if (result.isConfirmed) {
        this.selectedType = type;
        this.clearFields();
      }
    } else {
      this.selectedType = type;
    }
    this.assignQRContentType(type);
  }

  generateQRCode() {
    let qrData = '';
    switch (this.selectedType) {
      case 'Link':
      case 'firstLink':
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

    if (qrData != '') {
      this.qrCodeGeneratorService.getQrCode(qrData, this.selectedType).subscribe(
        (qrCodeImage: string) => {
          this.qrCodeImage = qrCodeImage;
        },
        (error) => {
          console.error("Error al obtener el código QR", error);
        }
      );      
      //this.qrCodeImage = `https://localhost:7136/qr-api/QrController/generate?url=${encodeURIComponent(qrData)}&qrType=${this.selectedType}`;
    }
  }

  clearFields() {
    this.qrContent = {};
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

  assignQRContentType(type: string): void {
    this.qrContent = null;
    switch (type) {
      case 'Link':
      case 'firstLink':
        this.qrContent = new LinkFields('');
        break;
      case 'Email':
        this.qrContent = new EmailFields('', '', '');
        break;
      case 'Text':
        this.qrContent = new TextFields('');
        break;
      case 'Call':
        this.qrContent = new CallFields('', '');
        break;
      case 'Sms':
        this.qrContent = new SmsFields('', '', '');
        break;
      case 'WhatsApp':
        this.qrContent = new WhatsappFields('', '', '');
        break;
    }
  }

  hasAnyFieldWithValue(type: string): boolean {
    switch (type) {
      case 'Link':
        return (this.qrContent.url != '');
        break;
      case 'Email':
        return (this.qrContent.to != '' || this.qrContent.subject != '' || this.qrContent.message != '');
        break;
      case 'Text':
        return (this.qrContent.text != '');
        break;
      case 'Call':
        return (this.qrContent.countryCode != '' || this.qrContent.phoneNumber != '');
        break;
      case 'Sms':
        return (this.qrContent.countryCode != '' || this.qrContent.phoneNumber != '' || this.qrContent.message != '');
        break;
      case 'WhatsApp':
        return (this.qrContent.countryCode != '' || this.qrContent.phoneNumber != '' || this.qrContent.message != '');
        break;
      default:
        return false;
    }
  }

  async triggerConfirm(): Promise<SweetAlertResult> {
    let result = await Swal.fire({
      title: '¿Cambiar tipo de QR Code?',
      text: 'Esto limpiará los campos actuales.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#333333',
      cancelButtonColor: '#E6E6E6',
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'my-confirm-button',
        cancelButton: 'my-cancel-button'
      }
    });
    return result;
  }

  copyToClipBoard() {
    const qrCodeImage = this.qrCodeImage;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = qrCodeImage;
  
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
  
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob(blob => {
          if (blob) {
            const item = new ClipboardItem({ 'image/png': blob });
            navigator.clipboard.write([item]).then(() => {
              console.log('Image copied to clipboard');
              Swal.fire({
                title: 'Copied!',
                text: 'QR Code image has been copied to your clipboard.',
                icon: 'success',
                confirmButtonText: 'OK'
              });
            }).catch(err => {
              console.error('Failed to copy image: ', err);
            });
          }
        });
      }
    };
  }
  
}
