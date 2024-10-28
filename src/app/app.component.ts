import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { QrGeneratorComponent } from './qr-generator/qr-generator.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, QrGeneratorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent {
  title = 'qr-generator';
}
