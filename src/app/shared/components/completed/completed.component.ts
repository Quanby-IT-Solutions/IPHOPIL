import { Component, OnInit, ViewChild, ElementRef, QueryList, ViewChildren, signal, computed } from '@angular/core';
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
  imports: [CommonModule, FormsModule, QRCodeModule, RouterLink],  // Ensure QRCodeModule is included here
  templateUrl: './completed.component.html',
  styleUrls: ['./completed.component.css']
})
export class CompletedComponent implements OnInit {
  documents = signal<Document[]>([]);
  filteredDocuments = signal<Document[]>([]);
  paginatedDocuments = signal<Document[]>([]);
  searchQuery = signal('');
  currentPage = signal(1);
  itemsPerPage = signal(5);

  showUndoConfirmationModal: boolean = false;

  totalPages = computed(() => Math.ceil(this.filteredDocuments().length / this.itemsPerPage()));

  showFilterModal = signal(false);
  types = signal<string[]>([]);
  offices = signal<string[]>([]);
  categories = signal<string[]>([]);

  selectedType = signal('All Types');
  selectedOffice = signal('All Offices');
  selectedCategory = signal('All Categories');

  @ViewChildren('qrcodeContainer') qrcodeContainers!: QueryList<ElementRef>;
  @ViewChildren('barcodeContainer') barcodeContainers!: QueryList<ElementRef>;

  constructor(private router: Router, private userService: UserService) {} // Inject UserService

  async ngOnInit(): Promise<void> {
    this.loadDocuments(); // Load documents from UserService
    this.loadDummyFilterOptions(); // Load dummy filter options instead of fetching from Supabase
  }

  loadDocuments(): void {
    // Fetch completed documents from UserService
    this.documents.set(this.userService.getCompletedDocuments());
    this.filterDocuments(); // Apply the filter to the documents
  }

  loadDummyFilterOptions(): void {
    this.types.set(['All Types', 'Type A', 'Type B', 'Type C']);
    this.offices.set(['All Offices', 'Office A', 'Office B', 'Office C']);
    this.categories.set(['All classification', 'classification 1', 'classification 2', 'classification 3']);
  }

  filterDocuments(): void {
    const filtered = this.documents().filter((doc) => {
      const matchesSearch = Object.values(doc).some((val) =>
        val.toString().toLowerCase().includes(this.searchQuery().toLowerCase())
      );
      const matchesType = this.selectedType() === 'All Types' || doc.type_name === this.selectedType();
      const matchesOffice = this.selectedOffice() === 'All Offices' || doc.office_name === this.selectedOffice();
      const matchesCategory = this.selectedCategory() === 'All Categories' || doc.category_name === this.selectedCategory();

      return matchesSearch && matchesType && matchesOffice && matchesCategory;
    });
    this.filteredDocuments.set(filtered);
    this.currentPage.set(1);
    this.paginateDocuments();
  }

  paginateDocuments(): void {
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage();
    const endIndex = startIndex + this.itemsPerPage();
    this.paginatedDocuments.set(this.filteredDocuments().slice(startIndex, endIndex));
  }

  changePage(page: number | string): void {
    const pageNumber = typeof page === 'string' ? parseInt(page, 10) : page;
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= this.totalPages()) {
      this.currentPage.set(pageNumber);
      this.paginateDocuments();
    }
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

  getPaginationArray(): (number | string)[] {
    const totalPages = this.totalPages();
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const currentPage = this.currentPage();
    if (currentPage <= 3) {
      return [1, 2, 3, 4, '...', totalPages - 1, totalPages];
    }
    if (currentPage >= totalPages - 2) {
      return [1, 2, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  }

  viewDetails(documentCode: string): void {
    this.router.navigate(['/user/view-details', documentCode]);
  }

  printQRCode(doc: Document): void {
    const qrCodeContainer = this.qrcodeContainers.find(container => container.nativeElement.getAttribute('data-doc-code') === doc.code);
    if (qrCodeContainer) {
      const qrCodeCanvas = qrCodeContainer.nativeElement.querySelector('canvas');
      if (qrCodeCanvas) {
        const printWindow = window.open('', '', 'height=600,width=800');
        if (printWindow) {
          const qrCodeDataUrl = qrCodeCanvas.toDataURL();
          printWindow.document.open();
          printWindow.document.write(`
            <html>
              <head>
                <title>Print QR Code</title>
                <style>
                  body, html {
                    margin: 0;
                    padding: 0;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                  }
                  img {
                    max-width: 100%;
                    max-height: 100%;
                    object-fit: contain;
                  }
                </style>
              </head>
              <body>
                <img src="${qrCodeDataUrl}" />
              </body>
            </html>
          `);
          printWindow.document.close();
          printWindow.focus();
          printWindow.print();
        }
      }
    }
  }
  
  generateAndPrintBarcode(doc: Document): void {
    console.log("Generate and Print Barcode:", doc);
    const barcodeContainer = this.barcodeContainers.find(container => container.nativeElement.getAttribute('data-doc-code') === doc.code);
    if (barcodeContainer) {
      const barcodeElement = barcodeContainer.nativeElement.querySelector('svg');
      if (barcodeElement) {
        // Generate the barcode
        JsBarcode(barcodeElement, doc.code, { format: 'CODE128', width: 2, height: 40, displayValue: true });
        
        // Ensure the barcode is rendered before printing
        setTimeout(() => {
          const barcodeSvg = barcodeElement.outerHTML;
          const printWindow = window.open('', '', 'height=600,width=800');
          if (printWindow) {
            printWindow.document.open();
            printWindow.document.write(`
              <html>
                <head>
                  <title>Print Barcode</title>
                  <style>
                    body, html {
                      margin: 0;
                      padding: 0;
                      height: 100%;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                    }
                    svg {
                      max-width: 100%;
                      height: auto;
                    }
                  </style>
                </head>
                <body>
                  ${barcodeSvg}
                </body>
              </html>
            `);
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
          }
        }, 100); // Adjust the timeout if necessary
      }
    }
  }

  openUndoConfirmation(): void {
    this.showUndoConfirmationModal = true;
  }

  closeUndoConfirmation(): void {
    this.showUndoConfirmationModal = false;
  }

  confirmUndo(): void {
    this.showUndoConfirmationModal = false;
  }
}