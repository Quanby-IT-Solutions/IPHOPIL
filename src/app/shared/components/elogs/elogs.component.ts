import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface LogEntry {
  action: 'Created' | 'Released' | 'Received' | 'Completed';
  dateTime: string;
  documentCode: string;
  createdBy?: string;
  releasedTo?: string;
  releasedBy?: string;
  receivedFrom?: string;
  receivedBy?: string;
  completedBy?: string;
  category: string;
  type: string;
  subjectTitle: string;
}

@Component({
  selector: 'app-elogs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './elogs.component.html',
  styleUrls: ['./elogs.component.css'],
})
export class ElogsComponent implements OnInit {
  logs: LogEntry[] = [];
  filteredLogs: LogEntry[] = [];
  paginatedLogs: LogEntry[] = [];
  searchQuery: string = '';
  selectedActions: Set<'Created' | 'Released' | 'Received' | 'Completed'> = new Set();
  currentPage: number = 1;
  itemsPerPage: number = 10;
  isLoading: boolean = false;

  constructor(private router: Router) {
    this.loadLogs();
  }

  ngOnInit(): void {}

  loadLogs(): void {
    this.logs = [
      {
        action: 'Created',
        dateTime: '2024-09-01 10:00',
        documentCode: 'DOC001',
        createdBy: 'John Doe',
        category: 'Internal',
        type: 'Report',
        subjectTitle: 'Monthly Report',
      },
      {
        action: 'Released',
        dateTime: '2024-09-01 11:00',
        documentCode: 'DOC001',
        releasedTo: 'External Agency A',
        releasedBy: 'Jane Smith',
        category: 'Internal',
        type: 'Report',
        subjectTitle: 'Monthly Report',
      },
      {
        action: 'Received',
        dateTime: '2024-09-02 09:00',
        documentCode: 'DOC002',
        receivedFrom: 'External Agency B',
        receivedBy: 'Michael Johnson',
        category: 'External',
        type: 'Memo',
        subjectTitle: 'Policy Update',
      },
      {
        action: 'Completed',
        dateTime: '2024-09-03 14:00',
        documentCode: 'DOC003',
        completedBy: 'Emily Brown',
        category: 'Internal',
        type: 'Project',
        subjectTitle: 'Q3 Goals',
      },
      {
        action: 'Created',
        dateTime: '2024-09-04 08:30',
        documentCode: 'DOC004',
        createdBy: 'Alice Green',
        category: 'Internal',
        type: 'Report',
        subjectTitle: 'Annual Budget Review',
      },
      {
        action: 'Released',
        dateTime: '2024-09-05 09:15',
        documentCode: 'DOC005',
        releasedTo: 'Client D',
        releasedBy: 'Robert White',
        category: 'External',
        type: 'Proposal',
        subjectTitle: 'New Project Proposal',
      },
      {
        action: 'Received',
        dateTime: '2024-09-06 12:00',
        documentCode: 'DOC006',
        receivedFrom: 'Team XYZ',
        receivedBy: 'Laura Black',
        category: 'Internal',
        type: 'Email',
        subjectTitle: 'Project Kickoff Details',
      },
      {
        action: 'Completed',
        dateTime: '2024-09-07 10:45',
        documentCode: 'DOC007',
        completedBy: 'Kevin Brown',
        category: 'Internal',
        type: 'Project',
        subjectTitle: 'Website Update',
      },
      {
        action: 'Created',
        dateTime: '2024-09-08 14:00',
        documentCode: 'DOC008',
        createdBy: 'Sophie Turner',
        category: 'Internal',
        type: 'Report',
        subjectTitle: 'Sales Performance Report',
      },
      {
        action: 'Released',
        dateTime: '2024-09-09 15:30',
        documentCode: 'DOC009',
        releasedTo: 'Management Team',
        releasedBy: 'Daniel Lee',
        category: 'Internal',
        type: 'Presentation',
        subjectTitle: 'Quarterly Review',
      },
      {
        action: 'Received',
        dateTime: '2024-09-10 11:00',
        documentCode: 'DOC010',
        receivedFrom: 'Client E',
        receivedBy: 'Chloe White',
        category: 'External',
        type: 'Contract',
        subjectTitle: 'Service Agreement',
      },
      {
        action: 'Completed',
        dateTime: '2024-09-11 13:00',
        documentCode: 'DOC011',
        completedBy: 'Tom Harris',
        category: 'Internal',
        type: 'Project',
        subjectTitle: 'New Feature Launch',
      },
      {
        action: 'Created',
        dateTime: '2024-09-12 09:30',
        documentCode: 'DOC012',
        createdBy: 'Sarah Miller',
        category: 'Internal',
        type: 'Proposal',
        subjectTitle: 'Budget Increase Request',
      },
      {
        action: 'Released',
        dateTime: '2024-09-13 10:00',
        documentCode: 'DOC013',
        releasedTo: 'External Agency F',
        releasedBy: 'Angela Patel',
        category: 'External',
        type: 'Report',
        subjectTitle: 'Market Analysis',
      },
      {
        action: 'Received',
        dateTime: '2024-09-14 14:30',
        documentCode: 'DOC014',
        receivedFrom: 'Vendor G',
        receivedBy: 'David Kim',
        category: 'External',
        type: 'Invoice',
        subjectTitle: 'Invoice for Services',
      },
      {
        action: 'Completed',
        dateTime: '2024-09-15 11:00',
        documentCode: 'DOC015',
        completedBy: 'Emily Davis',
        category: 'Internal',
        type: 'Project',
        subjectTitle: 'Client Feedback Implementation',
      },
    ];
    this.filterLogs();
    this.isLoading = false;
  }

  filterByAction(action: 'Created' | 'Released' | 'Received' | 'Completed'): void {
    if (this.selectedActions.has(action)) {
      this.selectedActions.delete(action);
    } else {
      this.selectedActions.add(action);
    }
    this.filterLogs();
  }

  filterLogs(): void {
    this.filteredLogs = this.logs.filter((log) => {
      const searchTerm = this.searchQuery.toLowerCase();
      const searchFields = [
        log.documentCode,
        log.subjectTitle,
        log.category,
        log.type,
        log.createdBy,
        log.releasedTo,
        log.releasedBy,
        log.receivedFrom,
        log.receivedBy,
        log.completedBy,
      ];

      const matchesSearchQuery = searchTerm === '' || searchFields.some(field => 
        field?.toLowerCase().includes(searchTerm)
      );

      const matchesAction = this.selectedActions.size === 0 || this.selectedActions.has(log.action);

      return matchesSearchQuery && matchesAction;
    });

    // Reset to first page when filtering
    this.currentPage = 1;
    this.paginateLogs();
  }

  paginateLogs(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedLogs = this.filteredLogs.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    if (page !== this.currentPage) {
      this.currentPage = page;
      this.paginateLogs();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.filteredLogs.length / this.itemsPerPage);
  }

  viewDetails(documentCode: string): void {
    this.router.navigate(['/user/view-details', documentCode]);
  }

  generateReports(): void {
    this.router.navigate(['user/u-generate']);
  }
}
