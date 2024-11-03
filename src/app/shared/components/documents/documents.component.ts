import { Component, OnInit, signal, computed, ViewChild, ElementRef, QueryList, ViewChildren  } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../../core/services/supabase.service';
import { map } from 'rxjs/operators';
import { switchMap } from 'rxjs';
import JsBarcode from 'jsbarcode';
import { QRCodeModule } from 'angularx-qrcode';
import { Document, Category, Type, NewDocument, ReleaseDocumentInfo, User, LogEntry } from '../../types';
import { SupabaseClient } from '@supabase/supabase-js';

export interface Office {
  office_id: number;  // Changed to number to match Supabase
  office_name: string;
}

export interface AccountData {
  account_id: number;  // Assuming this is also a number in Supabase
  name: string;
}

interface DocumentData {
  document_id: number;
  code: string;
  subject_title: string;
  category_id: number;
  type_id: number;
  created_by: number;
  created_at: string;
  office_id?: number;
  office_name?: string;
}




@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, QRCodeModule],
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {
  @ViewChild('newDocumentModal') newDocumentModal!: ElementRef<HTMLDialogElement>;
  @ViewChild('releaseDocumentModal') releaseDocumentModal!: ElementRef<HTMLDialogElement>;
  @ViewChild('filterModal') filterModal!: ElementRef<HTMLDialogElement>;
  @ViewChildren('qrcodeContainer') qrcodeContainers!: QueryList<ElementRef>;
  @ViewChildren('barcodeContainer') barcodeContainers!: QueryList<ElementRef>;


  newDocumentData: {
    subject: string;
    category: string;
    type: string;
    attachments: string[];
    office: string;
  } = {
    subject: '',
    category: '',
    type: '',
    attachments: [],
    office: '' 
  };

  documents = signal<Document[]>([]);
  filteredDocuments = signal<Document[]>([]);
  searchQuery = signal('');
  currentPage = signal(1);
  itemsPerPage = signal(5);

  offices: Office[] = [];
  docs: Document[] = [];
  categories: Category[] = [];
  types: Type[] = [];

  openDropdown = signal<string | null>(null);
  newDocument = signal<NewDocument>({ subject: '', category: '', type: '', attachments: [] });
  releaseDocumentInfo = signal<ReleaseDocumentInfo>({ 
    code: '', 
    receivingOffice: '', 
    message: '', 
    document_id: '' 
  });

  totalPages = computed(() => Math.ceil(this.filteredDocuments().length / this.itemsPerPage()));
  supabase: SupabaseClient;

  constructor(private router: Router, private supabaseService: SupabaseService) {
    this.supabase = this.supabaseService.supabase as SupabaseClient;
  }

  ngOnInit(): void {
    this.loadDocuments();
    this.supabaseService.documents$.subscribe((docs) => {
      this.docs = docs;
    });
    this.supabaseService.categories$.subscribe((categories: Category[]) => {
      this.categories = categories;
    });
    this.supabaseService.types$.subscribe((types: Type[]) => {
      this.types = types;
    });
    this.supabaseService.offices$.subscribe(offices => {
      this.offices = offices;
    });
    this.supabaseService.fetchDocuments();
    this.supabaseService.fetchCategories();
    this.supabaseService.fetchOffices();
    this.supabaseService.categories$.subscribe(categories => this.categories = categories);
    this.supabaseService.types$.subscribe(types => this.types = types);
    this.supabaseService.types$.subscribe((types: Type[]) => {
      if (types) {
        this.types = types; 
      }
    });
  }

  onCategoryChange(categoryId: string): void {
    this.newDocument.update(doc => ({ ...doc, category: categoryId }));
    this.supabaseService.fetchTypesByCategory(categoryId); 
  }

  // fetchOffices(): void {
  //   this.supabaseService.getAgencies().then(offices => {
  //     this.offices = offices;
  //   }).catch(error => {
  //     console.error('Error fetching offices:', error);
  //   });
  // }

  async onNewDocumentClick(): Promise<void> {
    const userId = await this.supabaseService.getCurrentUserId();
    if (userId) {
      console.log('Current User ID:', userId);
    } else {
      console.error('Unable to fetch current user ID.');
    }
  }

  loadDocuments(): void {
    this.supabaseService.fetchAllData().pipe(
      switchMap(({ categories, types, account, office }) => {
        // Create maps using number keys
        const categoryMap = new Map(categories.map(cat => [Number(cat.category_id), cat.name]));
        const typeMap = new Map(types.map(type => [Number(type.type_id), type.name]));
        const accountMap = new Map(account.map(acc => [Number(acc.account_id), acc.name]));
        const officeMap = new Map(office.map(off => [Number(off.office_id), off.office_name]));
  
        return this.supabaseService.documents$.pipe(
          map((data: DocumentData[]) => {
            const uniqueDocuments = Array.from(
              new Map(data.map(doc => [doc.code, doc])).values()
            );
            return uniqueDocuments.map((doc): Document => ({
              document_id: doc.document_id.toString(),
              code: doc.code,
              subject: doc.subject_title,
              category: categoryMap.get(doc.category_id) || 'Unknown',
              type: typeMap.get(doc.type_id) || 'Unknown',
              createdBy: accountMap.get(doc.created_by) || 'Unknown',
              dateCreated: doc.created_at,
              logbook: [],
              attachments: [],
              originOffice: doc.office_id ? officeMap.get(doc.office_id) || 'Unknown' : 'Unknown',
              office_name: doc.office_name || 'Unknown'
            }));
          })
        );
      })
    ).subscribe((documents: Document[]) => {
      if (documents) {
        this.docs = documents;
        this.filteredDocuments.set(documents);
      }
    });
  }

  // Update fetchOffices method
  fetchOffices(): void {
    this.supabaseService.getAgencies().then((offices: Office[]) => {
      this.offices = offices;
    }).catch(error => {
      console.error('Error fetching offices:', error);
    });
  }

  filterDocuments(): void {
    const filtered = this.documents().filter((doc) =>
      Object.values(doc).some((val) =>
        val.toString().toLowerCase().includes(this.searchQuery().toLowerCase())
      )
    );
    this.filteredDocuments.set(filtered);
    this.currentPage.set(1);
    this.paginateDocuments();
  }

  paginateDocuments(): void {
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage();
    const endIndex = startIndex + this.itemsPerPage();
    const paginatedDocs = this.filteredDocuments().slice(startIndex, endIndex);
    this.filteredDocuments.set(paginatedDocs);
  }

  changePage(page: number | string): void {
    const pageNumber = typeof page === 'string' ? parseInt(page, 10) : page;
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= this.totalPages()) {
      this.currentPage.set(pageNumber);
      this.paginateDocuments();
    }
  }

  toggleDropdown(code: string) {
    if (this.openDropdown() === code) {
      this.openDropdown.set(null);
    } else {
      this.openDropdown.set(code);
    }
  }
  

  async createNewDocument(): Promise<void> {
    try {
      const userId = await this.supabaseService.getCurrentUserId();
      if (!userId) {
        window.alert('Failed to determine the current user.');
        return;
      }

      if (!this.newDocumentData.subject) {
        window.alert('Subject/Title is required.');
        return;
      }
      if (!this.newDocumentData.category) {
        window.alert('Category is required.');
        return;
      }
      if (!this.newDocumentData.type) {
        window.alert('Type is required.');
        return;
      }

      const uniqueCode = this.generateUniqueCode();
  
      const documentData = {
        code: uniqueCode,
        subject_title: this.newDocumentData.subject,
        category_id: this.newDocumentData.category,
        type_id: this.newDocumentData.type,
        created_by: userId,
        attachments: this.newDocumentData.attachments,
        created_at: new Date().toISOString()
      };
  
      const { error } = await this.supabaseService.insertDocument(documentData);
  
      if (error) {
        console.error('Error saving document:', error.message);
        window.alert('Error saving document: ' + error.message);
        return;
      }
  
      window.alert('Document created successfully!');
      this.loadDocuments();
    } catch (err) {
      if (err instanceof Error) {
        console.error('Unexpected error:', err.message);
        window.alert('Unexpected error: ' + err.message);
      } else {
        console.error('An unexpected error occurred:', err);
        window.alert('An unexpected error occurred.');
      }
    }
  }

  // async getCurrentUser(): Promise<User | null> {
  //   if (!this.supabase) {
  //     console.error('Supabase client not initialized.');
  //     return null;
  //   }
  
  //   // Check session
  //   const session = this.supabase.auth.session();
  //   if (!session) {
  //     console.error('No active session found.');
  //     return null;
  //   }
  
  //   try {
  //     const { data, error } = await this.supabase.auth.getUser();
  //     console.log('Supabase getUser response:', data, error);
      
  //     if (error) {
  //       console.error('Error fetching user:', error.message);
  //       return null;
  //     }
  
  //     return data?.user ? { user: { id: data.user.id } } : null;
  //   } catch (err) {
  //     if (err instanceof Error) {
  //       console.error('Unexpected error occurred while fetching user:', err.message);
  //     } else {
  //       console.error('Unexpected error occurred while fetching user:', err);
  //     }
  //     return null;
  //   }
  // }
  
  
  // Update getCurrentUser method to use getSession instead of session()
  async getCurrentUser(): Promise<User | null> {
    if (!this.supabase) {
      console.error('Supabase client not initialized.');
      return null;
    }
  
    try {
      // Use getSession instead of session()
      const { data: { session }, error } = await this.supabase.auth.getSession();
      if (!session || error) {
        console.error('No active session found or error:', error?.message);
        return null;
      }
  
      const { data, error: userError } = await this.supabase.auth.getUser();
      console.log('Supabase getUser response:', data, userError);
      
      if (userError) {
        console.error('Error fetching user:', userError.message);
        return null;
      }
  
      return data?.user ? { user: { id: data.user.id } } : null;
    } catch (err) {
      if (err instanceof Error) {
        console.error('Unexpected error occurred while fetching user:', err.message);
      } else {
        console.error('Unexpected error occurred while fetching user:', err);
      }
      return null;
    }
  }
  
  // Update currentUser getter to use getUser
  get currentUser() {
    return this.supabase.auth.getUser();
  }
generateUniqueCode(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}


  async getCurrentOffice(): Promise<string> {
    return 'Current Office';
  }

  async releaseDocument(): Promise<void> {
    const currentOffice = await this.getCurrentOffice();

    this.documents.update(docs =>
      docs.map(doc => {
        if (doc.code === this.releaseDocumentInfo().code) {
          const newLogEntry: LogEntry = {
            from: currentOffice,
            to: this.releaseDocumentInfo().receivingOffice,
            dateReleased: new Date().toISOString()
          };
          return {
            ...doc,
            logbook: [...doc.logbook, newLogEntry]
          };
        }
        return doc;
      })
    );
  

    await this.saveReleasedDocumentToDb({
      documentId: this.releaseDocumentInfo().code, 
      message: this.releaseDocumentInfo().message,
      receivingOffice: this.newDocumentData.office,
      dateReleased: new Date().toISOString()
    });

    this.releaseDocumentInfo.set({ code: '', receivingOffice: '', message: '', document_id: '' });
    this.releaseDocumentModal.nativeElement.close();
  }

  async saveReleasedDocumentToDb(releaseData: {
    documentId: string;
    message: string;
    receivingOffice: string;
    dateReleased: string;
  }): Promise<void> {
    await this.supabaseService.insertOutgoingDocument(releaseData);
  }

  viewDetails(documentCode: string): void {
    this.router.navigate(['/user/view-details', documentCode]);
  }

  handleFileInput(event: Event): void {
    const element = event.target as HTMLInputElement;
    const files = element.files;
    if (files) {
      this.newDocument.update(current => ({
        ...current,
        attachments: Array.from(files)
      }));
    }
  }

  updateNewDocument(field: keyof NewDocument, value: string): void {
    this.newDocument.update(current => ({ ...current, [field]: value }));
  }

  updateReleaseDocumentInfo(field: keyof ReleaseDocumentInfo, value: string): void {
    this.releaseDocumentInfo.update(current => ({ ...current, [field]: value }));
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

  openReleaseModal(documentCode: string): void {
    this.releaseDocumentInfo.set({ code: documentCode, receivingOffice: '', message: '', document_id: '' });
    this.releaseDocumentModal.nativeElement.showModal();
  }

  scanQRCode(): void {
    console.log('Scanning QR Code');
  }

  fetchInitialData(): void {
    this.supabaseService.fetchCategories();
    this.supabaseService.categories$.subscribe((categories: Category[]) => {
      this.categories = categories;
    });

    this.supabaseService.fetchOffices();
    this.supabaseService.offices$.subscribe((offices) => {
      this.offices = offices;
    });
  }

  applyFilter(): void {
    this.filterModal.nativeElement.close();

    const filtered = this.documents().filter((doc) => {
      return (
        (this.filterData.category ? doc.category === this.filterData.category : true) &&
        (this.filterData.type ? doc.type === this.filterData.type : true) &&
        (this.filterData.office ? doc.originOffice === this.filterData.office : true)
      );
    });

    this.filteredDocuments.set(filtered);
    this.currentPage.set(1);
    this.paginateDocuments();
  }

  filterData = {
    category: '',
    type: '',
    office: '',
  };

  openFilterModal(): void {
    this.filterModal.nativeElement.showModal();
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
        }, 100); 
      }
    }
  }

  releaseDocuments(): void {
    this.router.navigate(['user/document-release']);
  }
}
