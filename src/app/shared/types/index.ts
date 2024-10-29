 export interface Document {
  document_id: string;
  code: string;
  subject: string;
  category: string;
  type: string;
  attachments: File[];
  createdBy: string;
  dateCreated: string;
  originOffice: string;
  logbook: LogEntry[];
  office_name: string;
  category_name?: string;
  creator_name?: string; 
  type_name?: string; 

}

export interface LogEntry {
  from: string;
  to: string;
  dateReleased: string;
}

export interface NewDocument {
  subject: string;
  category: string;
  type: string;
  attachments: File[];
}

export interface ReleaseDocumentInfo {
  document_id: string;
  code: string;
  receivingOffice: string;
  message: string;
}

export interface Category {
  category_id: string; // This should match the type used in `supabase.service.ts`
  name: string;
}

export interface User {
  user: {
    id: string;
    // other properties if needed
  };
}

export interface Type {
  type_id: string;
  name: string;
}
