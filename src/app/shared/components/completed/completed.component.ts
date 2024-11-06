import { Component, OnInit, ElementRef, QueryList, ViewChildren, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode';
import JsBarcode from 'jsbarcode';
import { UserService } from '../../../core/services/user.service';

interface Document {
  code: string;
  document_id: string;
  subject_title: string;
  category_name: string;
  type_name: string;
  message: string;
  office_name: string;
  account_name: string;
  received_date_received: string;
  received: boolean;
}

@Component({
  selector: 'app-completed',
  standalone: true,
  imports: [CommonModule, FormsModule, QRCodeModule, RouterLink],
  templateUrl: './completed.component.html',
  styleUrls: ['./completed.component.css']
})
export class CompletedComponent implements OnInit {
  // Document Management
  documents = signal<Document[]>([]);
  filteredDocuments = signal<Document[]>([]);
  paginatedDocuments = signal<Document[]>([]);
  selectedDocument = signal<Document | null>(null);
  
  // Search and Pagination
  searchQuery = signal('');
  currentPage = signal(1);
  itemsPerPage = signal(5);
  
  // Loading State
  loading = signal(false);

  // Computed Values
  totalPages = computed(() => Math.ceil(this.filteredDocuments().length / this.itemsPerPage()));
  isFirstPage = computed(() => this.currentPage() === 1);
  isLastPage = computed(() => this.currentPage() === this.totalPages());

  // Stats Computed Values
  totalDocuments = computed(() => this.documents().length);
  completedToday = computed(() => {
    const today = new Date().toLocaleDateString();
    return this.documents().filter(doc => 
      new Date(doc.received_date_received).toLocaleDateString() === today
    ).length;
  });

  // Modal States
  showFilterModal = signal(false);
  showUndoConfirmationModal = signal(false);

  // Filter Options
  types = signal<string[]>([]);
  offices = signal<string[]>([]);
  categories = signal<string[]>([]);
  selectedType = signal('All Types');
  selectedOffice = signal('All Offices');
  selectedCategory = signal('All classification');

  // ViewChildren for QR and Barcode
  @ViewChildren('qrcodeContainer') qrcodeContainers!: QueryList<ElementRef>;
  @ViewChildren('barcodeContainer') barcodeContainers!: QueryList<ElementRef>;

  constructor(private router: Router, private userService: UserService) {}

  async ngOnInit(): Promise<void> {
    try {
      this.loading.set(true);
      await this.loadInitialData();
    } catch (error) {
      console.error('Error initializing component:', error);
    } finally {
      this.loading.set(false);
    }
  }

  private async loadInitialData(): Promise<void> {
    this.loadDocuments();
    this.loadFilterOptions();
  }

  loadDocuments(): void {
    try {
      const docs = this.userService.getCompletedDocuments();
      this.documents.set(docs);
      this.filterDocuments();
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  }

  private loadFilterOptions(): void {
    this.types.set(['All Types', 'Type A', 'Type B', 'Type C']);
    this.offices.set(['All Offices', 'Office A', 'Office B', 'Office C']);
    this.categories.set(['All classification', 'classification 1', 'classification 2', 'classification 3']);
  }

  filterDocuments(): void {
    try {
      const filtered = this.documents().filter((doc) => {
        const searchTerm = this.searchQuery().toLowerCase();
        const matchesSearch = Object.values(doc).some((val) =>
          val?.toString().toLowerCase().includes(searchTerm)
        );

        const matchesType = this.selectedType() === 'All Types' || doc.type_name === this.selectedType();
        const matchesOffice = this.selectedOffice() === 'All Offices' || doc.office_name === this.selectedOffice();
        const matchesCategory = this.selectedCategory() === 'All classification' || 
                              doc.category_name === this.selectedCategory();

        return matchesSearch && matchesType && matchesOffice && matchesCategory;
      });

      this.filteredDocuments.set(filtered);
      this.currentPage.set(1);
      this.paginateDocuments();
    } catch (error) {
      console.error('Error filtering documents:', error);
    }
  }

  paginateDocuments(): void {
    try {
      const startIndex = (this.currentPage() - 1) * this.itemsPerPage();
      const endIndex = startIndex + this.itemsPerPage();
      this.paginatedDocuments.set(this.filteredDocuments().slice(startIndex, endIndex));
    } catch (error) {
      console.error('Error paginating documents:', error);
    }
  }

  changePage(page: number | string): void {
    try {
      const pageNumber = typeof page === 'string' ? parseInt(page, 10) : page;
      if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= this.totalPages()) {
        this.currentPage.set(pageNumber);
        this.paginateDocuments();
      }
    } catch (error) {
      console.error('Error changing page:', error);
    }
  }

  getPaginationArray(): (number | string)[] {
    const total = this.totalPages();
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const current = this.currentPage();
    if (current <= 3) {
      return [1, 2, 3, 4, '...', total - 1, total];
    }
    if (current >= total - 2) {
      return [1, 2, '...', total - 3, total - 2, total - 1, total];
    }
    return [1, '...', current - 1, current, current + 1, '...', total];
  }

  toggleFilterModal(): void {
    this.showFilterModal.set(!this.showFilterModal());
  }

  applyFilter(): void {
    this.filterDocuments();
    this.toggleFilterModal();
  }

  updateSelectedOffice(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedOffice.set(select.value);
  }

  updateSelectedCategory(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedCategory.set(select.value);
  }

  updateSelectedType(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedType.set(select.value);
  }

  printQRCode(doc: Document): void {
    try {
      this.loading.set(true);
      const container = this.qrcodeContainers.find(
        container => container.nativeElement.getAttribute('data-doc-code') === doc.code
      );
      
      if (container) {
        const canvas = container.nativeElement.querySelector('canvas');
        if (canvas) {
          this.openPrintWindow({
            title: `QR Code - ${doc.code}`,
            content: `<img src="${canvas.toDataURL()}" alt="QR Code" />`,
            document: doc
          });
        }
      }
    } catch (error) {
      console.error('Error printing QR code:', error);
    } finally {
      this.loading.set(false);
    }
  }

  generateAndPrintBarcode(doc: Document): void {
    try {
      this.loading.set(true);
      const container = this.barcodeContainers.find(
        container => container.nativeElement.getAttribute('data-doc-code') === doc.code
      );
      
      if (container) {
        const barcodeElement = container.nativeElement.querySelector('svg');
        if (barcodeElement) {
          JsBarcode(barcodeElement, doc.code, {
            format: 'CODE128',
            width: 2,
            height: 40,
            displayValue: true,
            fontSize: 16,
            margin: 10
          });

          setTimeout(() => {
            this.openPrintWindow({
              title: `Barcode - ${doc.code}`,
              content: barcodeElement.outerHTML,
              document: doc
            });
            this.loading.set(false);
          }, 100);
        }
      }
    } catch (error) {
      console.error('Error generating barcode:', error);
      this.loading.set(false);
    }
  }

  private openPrintWindow(options: { title: string; content: string; document: Document }): void {
    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${options.title}</title>
            <style>
              body, html {
                margin: 0;
                padding: 20px;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                font-family: Arial, sans-serif;
              }
              img, svg {
                max-width: 100%;
                max-height: 70vh;
                object-fit: contain;
              }
              .info {
                margin-top: 20px;
                text-align: center;
                font-size: 14px;
              }
              .info h2 {
                margin: 0 0 10px 0;
                font-size: 18px;
              }
              .info p {
                margin: 5px 0;
                color: #666;
              }
            </style>
          </head>
          <body>
            ${options.content}
            <div class="info">
              <h2>${options.document.code}</h2>
              <p>${options.document.subject_title}</p>
              <p>Category: ${options.document.category_name}</p>
              <p>Type: ${options.document.type_name}</p>
              <p>Office: ${options.document.office_name}</p>
              <p>Date: ${options.document.received_date_received}</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  }

  viewDetails(documentCode: string): void {
    this.router.navigate(['/user/view-details', documentCode]);
  }

  openUndoConfirmation(doc: Document): void {
    this.selectedDocument.set(doc);
    this.showUndoConfirmationModal.set(true);
  }

  closeUndoConfirmation(): void {
    this.showUndoConfirmationModal.set(false);
    this.selectedDocument.set(null);
  }

  async confirmUndo(): Promise<void> {
    if (!this.selectedDocument()) return;

    try {
      this.loading.set(true);
      // Implement your undo logic here
      // await this.userService.undoCompletion(this.selectedDocument()!);
      console.log('Undoing document completion:', this.selectedDocument());
      await this.loadDocuments();
    } catch (error) {
      console.error('Error undoing completion:', error);
    } finally {
      this.loading.set(false);
      this.closeUndoConfirmation();
    }
  }
}