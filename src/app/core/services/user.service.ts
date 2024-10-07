import { Injectable } from '@angular/core';

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

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Changed documents to incoming_documents
  private incoming_documents: Document[] = [
    {
      code: 'DOC001',
      document_id: '1',
      subject_title: 'Project Proposal',
      category_name: 'Proposals',
      type_name: 'Internal',
      message: 'Initial project proposal for review.',
      office_name: 'Development',
      account_name: 'John Doe',
      received_date_received: '2024-10-01T10:00:00',
      received: false,
    },
    {
      code: 'DOC002',
      document_id: '2',
      subject_title: 'Quarterly Report',
      category_name: 'Reports',
      type_name: 'Financial',
      message: 'Q3 Financial Overview.',
      office_name: 'Finance',
      account_name: 'Jane Smith',
      received_date_received: '2024-09-25T10:00:00',
      received: false,
    },
    {
      code: 'DOC003',
      document_id: '3',
      subject_title: 'Meeting Minutes',
      category_name: 'Minutes',
      type_name: 'Internal',
      message: 'Minutes from the last team meeting.',
      office_name: 'HR',
      account_name: 'Alice Johnson',
      received_date_received: '2024-10-03T10:00:00',
      received: false,
    },
    {
      code: 'DOC004',
      document_id: '4',
      subject_title: 'Invoice',
      category_name: 'Invoices',
      type_name: 'Accounts',
      message: 'Invoice for services rendered.',
      office_name: 'Accounts',
      account_name: 'Bob Brown',
      received_date_received: '2024-10-05T10:00:00',
      received: false,
    },
    {
      code: 'DOC005',
      document_id: '5',
      subject_title: 'Feedback Report',
      category_name: 'Feedback',
      type_name: 'External',
      message: 'Customer feedback from Q3.',
      office_name: 'Support',
      account_name: 'Charlie Davis',
      received_date_received: '2024-09-29T10:00:00',
      received: false,
    },
  ];

  // Added dummy data for received_documents
  private received_documents: Document[] = [
    {
      code: 'DOC006',
      document_id: '6',
      subject_title: 'Annual Review',
      category_name: 'Reviews',
      type_name: 'Internal',
      message: 'Annual performance review documents.',
      office_name: 'HR',
      account_name: 'Emily White',
      received_date_received: '2024-09-15T10:00:00',
      received: true,
    },
    {
      code: 'DOC007',
      document_id: '7',
      subject_title: 'New Policy Draft',
      category_name: 'Policies',
      type_name: 'Internal',
      message: 'Draft of the new company policy.',
      office_name: 'Compliance',
      account_name: 'Michael Green',
      received_date_received: '2024-09-18T10:00:00',
      received: true,
    },
    {
      code: 'DOC008',
      document_id: '8',
      subject_title: 'Budget Proposal',
      category_name: 'Proposals',
      type_name: 'Financial',
      message: 'Budget proposal for the upcoming fiscal year.',
      office_name: 'Finance',
      account_name: 'Sarah Black',
      received_date_received: '2024-09-20T10:00:00',
      received: true,
    },
    {
      code: 'DOC009',
      document_id: '9',
      subject_title: 'Team Building Activity',
      category_name: 'Activities',
      type_name: 'External',
      message: 'Details of the upcoming team building event.',
      office_name: 'HR',
      account_name: 'Tom Yellow',
      received_date_received: '2024-09-22T10:00:00',
      received: true,
    },
    {
      code: 'DOC010',
      document_id: '10',
      subject_title: 'Sales Strategy',
      category_name: 'Strategies',
      type_name: 'Internal',
      message: 'Sales strategy for the next quarter.',
      office_name: 'Sales',
      account_name: 'Linda Brown',
      received_date_received: '2024-09-25T10:00:00',
      received: true,
    },
  ];
  
  private outgoingDocuments: Document[] = [
    {
      code: 'DOC001',
      document_id: '1',
      subject_title: 'Project Proposal',
      category_name: 'Proposals',
      type_name: 'Internal',
      message: 'This is a proposal for the new project.',
      office_name: 'Head Office',
      account_name: 'Alice Johnson',
      received_date_received: '2024-09-20',
      received: false,
    },
    {
      code: 'DOC002',
      document_id: '2',
      subject_title: 'Meeting Agenda',
      category_name: 'Agendas',
      type_name: 'Internal',
      message: 'Agenda for the upcoming meeting.',
      office_name: 'Branch Office',
      account_name: 'Bob Smith',
      received_date_received: '2024-09-22',
      received: false,
    },
    {
      code: 'DOC003',
      document_id: '3',
      subject_title: 'Budget Report',
      category_name: 'Reports',
      type_name: 'Finance',
      message: 'Monthly budget report for review.',
      office_name: 'Finance Office',
      account_name: 'Charlie Brown',
      received_date_received: '2024-09-25',
      received: false,
    },
    {
      code: 'DOC004',
      document_id: '4',
      subject_title: 'Quarterly Review',
      category_name: 'Reviews',
      type_name: 'Management',
      message: 'Quarterly review meeting notes.',
      office_name: 'Management Office',
      account_name: 'Diana Prince',
      received_date_received: '2024-09-28',
      received: false,
    },
    {
      code: 'DOC005',
      document_id: '5',
      subject_title: 'Employee Onboarding',
      category_name: 'HR',
      type_name: 'Internal',
      message: 'Details for the new employee onboarding.',
      office_name: 'HR Office',
      account_name: 'Eve Adams',
      received_date_received: '2024-09-30',
      received: false,
    },
  ];

  // New completed_documents array
  private completed_documents: Document[] = [
    {
      code: 'COMP001',
      document_id: '11',
      subject_title: 'Completed Project Proposal',
      category_name: 'Proposals',
      type_name: 'Internal',
      message: 'Finalized project proposal ready for implementation.',
      office_name: 'Development',
      account_name: 'John Doe',
      received_date_received: new Date().toISOString(), // Current date-time
      received: true,
    },
    {
      code: 'COMP002',
      document_id: '12',
      subject_title: 'Completed Quarterly Report',
      category_name: 'Reports',
      type_name: 'Financial',
      message: 'Final quarterly financial report for approval.',
      office_name: 'Finance',
      account_name: 'Jane Smith',
      received_date_received: new Date().toISOString(), // Current date-time
      received: true,
    },
    {
      code: 'COMP003',
      document_id: '13',
      subject_title: 'Completed Meeting Minutes',
      category_name: 'Minutes',
      type_name: 'Internal',
      message: 'Approved minutes from the last team meeting.',
      office_name: 'HR',
      account_name: 'Alice Johnson',
      received_date_received: new Date().toISOString(), // Current date-time
      received: true,
    },
    {
      code: 'COMP004',
      document_id: '14',
      subject_title: 'Completed Invoice',
      category_name: 'Invoices',
      type_name: 'Accounts',
      message: 'Approved invoice for services rendered.',
      office_name: 'Accounts',
      account_name: 'Bob Brown',
      received_date_received: new Date().toISOString(), // Current date-time
      received: true,
    },
    {
      code: 'COMP005',
      document_id: '15',
      subject_title: 'Completed Feedback Report',
      category_name: 'Feedback',
      type_name: 'External',
      message: 'Final customer feedback report from Q3.',
      office_name: 'Support',
      account_name: 'Charlie Davis',
      received_date_received: new Date().toISOString(), // Current date-time
      received: true,
    },
  ];

  constructor() {}

  // Updated method to return incoming_documents
  getIncomingDocuments(): Document[] {
    return this.incoming_documents;
  }

  // Added method to return received_documents
  getReceivedDocuments(): Document[] {
    return this.received_documents;
  }

  // Method to get outgoing documents
  getOutgoingDocuments(): Document[] {
    return this.outgoingDocuments;
  }

  // New method to get completed documents
  getCompletedDocuments(): Document[] {
    return this.completed_documents;
  }
}
