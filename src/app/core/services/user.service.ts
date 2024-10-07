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
      code: 'AB1234CD',
      document_id: '31d4f8a3-df6a-4b66-ae59-0d0a8ad678a4',
      subject_title: 'Employee Confidential Report',
      category_name: 'Confidential',
      type_name: 'Report',
      message: 'Confidential Report dispatched',
      office_name: 'Development',
      account_name: 'Branch Office',
      received_date_received: '2024-10-01T10:00:00',
      received: false,
    },
    {
      code: 'XY7890Z1',
      document_id: '36e56fdd-4c0e-49ae-bf31-0c43f4789e68',
      subject_title: 'HR Department Policy',
      category_name: 'HR',
      type_name: 'Policy',
      message: 'HR Policy sent to branch',
      office_name: 'HR',
      account_name: 'Finance',
      received_date_received: '2024-09-25T10:00:00',
      received: false,
    },
    {
      code: 'TY5739DF',
      document_id: '398728de-0809-4f0c-876f-748cc8e8fa34',
      subject_title: 'Headquarters Policy Document',
      category_name: 'HR',
      type_name: 'Policy',
      message: 'Policy Document shared',
      office_name: 'HQ',
      account_name: 'Headquarters',
      received_date_received: '2024-10-03T10:00:00',
      received: false,
    },
    {
      code: 'QP1234LK',
      document_id: 'e13f8a7b-a00f-42d8-b33f-33a66c8e4e29',
      subject_title: 'Invoice for Services Rendered',
      category_name: 'Financial',
      type_name: 'Invoice',
      message: 'Invoice sent to Headquarters',
      office_name: 'Accounts',
      account_name: 'Accounts Department',
      received_date_received: '2024-10-05T10:00:00',
      received: false,
    },
    {
      code: 'FG7890JK',
      document_id: '1a43a596-9d53-44ed-b4b7-16412453f341',
      subject_title: 'Innovation Lab Confidential Report',
      category_name: 'Confidential',
      type_name: 'Report',
      message: 'Confidential report for innovation lab',
      office_name: 'Innovation',
      account_name: 'Innovation Lab',
      received_date_received: '2024-09-29T10:00:00',
      received: false,
    },
  ];

  // Added dummy data for received_documents
  private received_documents: Document[] = [
    {
      code: 'HG5678KL',
      document_id: 'f0d7d7c9-a548-482b-935e-249b7db411f1',
      subject_title: 'Legal Contract',
      category_name: 'Legal',
      type_name: 'Contract',
      message: 'Legal Contract received',
      office_name: 'Legal',
      account_name: 'Legal Affairs',
      received_date_received: '2024-09-29T10:00:00',
      received: true,
    },
    {
      code: 'XY4829CD',
      document_id: '03209f1d-16f1-4903-9e6b-b11d4b90e5d2',
      subject_title: 'HR Memo for All Employees',
      category_name: 'HR',
      type_name: 'Memo',
      message: 'HR Memo received',
      office_name: 'HR',
      account_name: 'HR Department',
      received_date_received: '2024-10-01T10:00:00',
      received: true,
    },
    {
      code: 'ZX9372LM',
      document_id: '2330f1d6-7ba7-4558-a78c-4781cbf91bb5',
      subject_title: 'Branch Office Quarterly Summary',
      category_name: 'Financial',
      type_name: 'Summary',
      message: 'Branch Quarterly Summary received',
      office_name: 'Finance',
      account_name: 'Branch Office',
      received_date_received: '2024-10-01T10:00:00',
      received: true,
    },
    {
      code: 'OD1937LK',
      document_id: 'ec2b7413-1dd4-4c16-bcb6-0e9cf60e3c17',
      subject_title: 'Quarterly Financial Update',
      category_name: 'Financial',
      type_name: 'Update',
      message: 'Q2 Financial Update received',
      office_name: 'Finance',
      account_name: 'Finance Department',
      received_date_received: '2024-10-02T10:00:00',
      received: true,
    },
    {
      code: 'LM4739PO',
      document_id: 'a9c1f61e-38b7-4780-93f0-251cdb30e2d4',
      subject_title: 'Satellite Office Legal Contract',
      category_name: 'Legal',
      type_name: 'Contract',
      message: 'Legal contract received from Satellite Office',
      office_name: 'Legal',
      account_name: 'Satellite Office',
      received_date_received: '2024-09-28T10:00:00',
      received: true,
    },
  ];
  
  private outgoing_documents: Document[] = [
    {
      code: 'FD1234GH',
      document_id: 'fd923fbe-6d8b-41c9-82f1-c4d2548f2e92',
      subject_title: 'Financial Report',
      category_name: 'Financial',
      type_name: 'Report',
      message: 'Financial report sent to regional office',
      office_name: 'Finance',
      account_name: 'Bob Brown',
      received_date_received: '2024-09-01T10:00:00',
      received: false,
    },
    {
      code: 'MK5678YZ',
      document_id: '6178a34a-435d-47ff-8d94-4f228d3a6e25',
      subject_title: 'Marketing Initiative Memo',
      category_name: 'Marketing',
      type_name: 'Memo',
      message: 'Marketing memo dispatched to HQ',
      office_name: 'Marketing',
      account_name: 'Charlie Davis',
      received_date_received: '2024-09-03T10:00:00',
      received: false,
    },
    {
      code: 'RE9101BC',
      document_id: '1a43a596-9d53-44ed-b4b7-16412453f341',
      subject_title: 'Innovation Lab Confidential Report',
      category_name: 'Confidential',
      type_name: 'Report',
      message: 'Report sent to Satellite Office',
      office_name: 'Research',
      account_name: 'Jane Doe',
      received_date_received: '2024-09-05T10:00:00',
      received: false,
    },
    {
      code: 'QP2345GH',
      document_id: '2330f1d6-7ba7-4558-a78c-4781cbf91bb5',
      subject_title: 'Branch Office Quarterly Summary',
      category_name: 'Financial',
      type_name: 'Report',
      message: 'Quarterly summary released to Branch Office',
      office_name: 'Branch Office',
      account_name: 'Alice Smith',
      received_date_received: '2024-09-07T10:00:00',
      received: false,
    },
    {
      code: 'FD5678JK',
      document_id: 'ec2b7413-1dd4-4c16-bcb6-0e9cf60e3c17',
      subject_title: 'Quarterly Financial Update',
      category_name: 'Financial',
      type_name: 'Report',
      message: 'Q2 Financial Update received',
      office_name: 'Finance',
      account_name: 'Mark Johnson',
      received_date_received: '2024-09-09T10:00:00',
      received: false,
    },
  ];

  // Completed documents
  private completed_documents: Document[] = [
    {
      code: 'QD1234GH',
      document_id: '31d4f8a3-df6a-4b66-ae59-0d0a8ad678a4',
      subject_title: 'Employee Confidential Report',
      category_name: 'Confidential',
      type_name: 'Report',
      message: 'Confidential Report completed',
      office_name: 'Office A',
      account_name: 'John Doe',
      received_date_received: '2024-09-01T10:00:00',
      received: true,
    },
    {
      code: 'QD5678YZ',
      document_id: '398728de-0809-4f0c-876f-748cc8e8fa34',
      subject_title: 'Headquarters Policy Document',
      category_name: 'HR',
      type_name: 'Policy',
      message: 'Policy Document completed',
      office_name: 'HR Department',
      account_name: 'Jane Smith',
      received_date_received: '2024-09-05T10:00:00',
      received: true,
    },
    {
      code: 'QD9101JK',
      document_id: 'f0d7d7c9-a548-482b-935e-249b7db411f1',
      subject_title: 'Legal Contract',
      category_name: 'Legal',
      type_name: 'Contract',
      message: 'Legal Contract completed',
      office_name: 'Legal Department',
      account_name: 'Alice Johnson',
      received_date_received: '2024-09-04T10:00:00',
      received: true,
    },
    {
      code: 'QD2345LM',
      document_id: '71e2e054-b342-4a67-bc06-123f3b230374',
      subject_title: 'Headquarters Marketing Strategy',
      category_name: 'Marketing',
      type_name: 'Report',
      message: 'Marketing Strategy completed',
      office_name: 'Marketing',
      account_name: 'Charlie Davis',
      received_date_received: '2024-09-06T10:00:00',
      received: true,
    },
    {
      code: 'QD6789NP',
      document_id: '82b3f680-69d1-47b6-84f4-3ec8da49a7a2',
      subject_title: 'Financial Records for Q1',
      category_name: 'Financial',
      type_name: 'Report',
      message: 'Q1 Financial Records completed',
      office_name: 'Finance',
      account_name: 'Bob Brown',
      received_date_received: '2024-09-08T10:00:00',
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
    return this.outgoing_documents;
  }

  // New method to get completed documents
  getCompletedDocuments(): Document[] {
    return this.completed_documents;
  }
}
