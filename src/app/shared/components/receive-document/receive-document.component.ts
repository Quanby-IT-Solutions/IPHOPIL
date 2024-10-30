import { CommonModule } from '@angular/common';
import { Component, Inject, PLATFORM_ID, signal, ViewChild, ElementRef, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { QRCodeModule } from 'angularx-qrcode';
import { Subject, debounceTime } from 'rxjs';
import { SupabaseService } from '../../../core/services/supabase.service';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';
import { AfterViewInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'app-receive-document',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, QRCodeModule,LottieComponent],
  templateUrl: './receive-document.component.html',
  styleUrl: './receive-document.component.css'
})
export class ReceiveDocumentComponent implements OnInit, AfterViewInit {
 
  styles: Partial<CSSStyleDeclaration> = {
    maxWidth: '500px',
    margin: '0 auto',
  };

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.documentCodeInput.nativeElement.focus();
      import('lottie-web').then((lottie) => {
      });
    }
  }

  
  documentCode = signal('');
  private inputChangeSubject = new Subject<string>();

  @ViewChild('documentCodeInput') documentCodeInput!: ElementRef;
  @ViewChild('activateScannerButton') activateScannerButton!: ElementRef; 

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object, 
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    this.inputChangeSubject.pipe(debounceTime(300)).subscribe(() => this.updateCode());
  }

  updateCode() {
    this.generateQRCode();

  }

  activateScanner() {
    console.log('Activating QR code scanner');

    this.activateScannerButton.nativeElement.focus();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
  
    const key = event.key;
    if (key.length === 1 || key === 'Backspace' || key === 'Delete') { 
      this.documentCodeInput.nativeElement.focus();
    }
  }

  scanQRCode() {
    console.log('Scanning QR Code');
  }

  cancel() {
    console.log('Cancelling');
  }

  proceed() {
    console.log('Proceed button clicked', this.documentCode());
    if (this.documentCode()) {
      this.router.navigate(['/user/receive-document-proceed', this.documentCode()]);
    } else {
      console.error('No document code entered');
    }
  }

  generateQRCode() {
  }

  onDocumentCodeChange(value: string) {
    this.documentCode.set(value);
    this.inputChangeSubject.next(value); 
  }

}
