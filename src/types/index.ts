export type PaperlessSearchType = {
  total: number;
  documents: {
    added: string;
    archive_serial_number: string;
    archived_file_name: string;
    content: string;
    correspondent: string;
    created: string;
    created_date: string;
    custom_fields: [];
    document_type: number;
    id: number;
    is_shared_by_requester: boolean;
    modified: string;
    notes: [];
    original_file_name: string;
    owner: number;
    storage_path: number;
    tags: [];
    title: string;
    user_can_change: boolean;
  }[];
  saved_views: [];
  correspondents: [];
  document_types: [];
  storage_paths: [];
  tags: [];
  users: [];
  groups: [];
  mail_accounts: [];
  mail_rules: [];
  custom_fields: [];
  workflows: [];
};

export type PaperlessDocumentsType = {
  count: number;
  next: null | string;
  previous: null | string;
  all: number[];
  results: {
    id: number;
    correspondent: number; // Change type as per actual data or use a specific type/interface
    document_type: number;
    storage_path: number;
    title: string;
    content: string;
    tags: number[];
    created: string; // ISO 8601 date string
    created_date: string; // Date string
    modified: string; // ISO 8601 date string
    added: string; // ISO 8601 date string
    archive_serial_number: number; // Change type as per actual data or use a specific type/interface
    original_file_name: string;
    archived_file_name: string;
    owner: number;
    user_can_change: boolean;
    is_shared_by_requester: boolean;
    notes: string[]; // Change type as per actual data or use a specific type/interface
    custom_fields: string[]; // Change type as per actual data or use a specific type/interface
    __search_hit__: {
      score: number;
      highlights: string;
      note_highlights: string;
      rank: number;
    };
  }[];
};
