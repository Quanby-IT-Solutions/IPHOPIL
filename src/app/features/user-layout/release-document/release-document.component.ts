import { CommonModule, Location } from '@angular/common'; // Import Location
import { Component, Inject, PLATFORM_ID, signal, ViewChild, ElementRef, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { QRCodeModule } from 'angularx-qrcode';
import { Subject, debounceTime } from 'rxjs';
import { SupabaseService } from '../../../core/services/supabase.service';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';

@Component({
  selector: 'app-release-document',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, QRCodeModule, LottieComponent],
  templateUrl: './release-document.component.html',
  styleUrls: ['./release-document.component.css']
})
export class UReleaseDocumentComponent {

  styles: Partial<CSSStyleDeclaration> = {
    maxWidth: '500px',
    margin: '0 auto',
  };

  documentCode = signal('');
  private inputChangeSubject = new Subject<string>();

  @ViewChild('documentCodeInput') documentCodeInput!: ElementRef; // Reference to input element
  @ViewChild('activateScannerButton') activateScannerButton!: ElementRef; // Reference to button element

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object, 
    private supabaseService: SupabaseService,
    private router: Router,
    private location: Location // Inject Location service
  ) {
    this.inputChangeSubject.pipe(debounceTime(300)).subscribe(() => this.updateCode());
  }

  updateCode() {
    this.generateQRCode();
  }

  activateScanner() {
    console.log('Activating QR code scanner');
    this.activateScannerButton.nativeElement.focus(); // Focus on the button
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const key = event.key;
    if (key.length === 1 || key === 'Backspace' || key === 'Delete') { // Handle normal keys and backspace
      this.documentCodeInput.nativeElement.focus();
    }
  }

  scanQRCode() {
    console.log('Scanning QR Code');
  }

  cancel() {
    console.log('Cancelling');
    this.location.back(); // Go back to the previous page
  }

  proceed() {
    console.log('Proceed button clicked', this.documentCode());
    if (this.documentCode()) {
      this.router.navigate(['/user/release-document-proceed', this.documentCode()]);
    } else {
      console.error('No document code entered');
    }
  }

  generateQRCode() {
    // Function to generate QR Code
  }

  onDocumentCodeChange(value: string) {
    this.documentCode.set(value);
    this.inputChangeSubject.next(value); // Emit value change
  }

}
