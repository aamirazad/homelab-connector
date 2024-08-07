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
    correspondent: number;
    document_type: number;
    storage_path: number;
    title: string;
    content: string;
    tags: number[];
    created: string;
    created_date: string;
    modified: string;
    added: string;
    archive_serial_number: number;
    original_file_name: string;
    archived_file_name: string;
    owner: number;
    user_can_change: boolean;
    is_shared_by_requester: boolean;
    notes: string[];
    custom_fields: string[];
    __search_hit__: {
      score: number;
      highlights: string;
      note_highlights: string;
      rank: number;
    };
  }[];
};

export type PaperlessDocumentType = {
  id: number;
  correspondent: number;
  document_type: number;
  storage_path: number;
  title: string;
  content: string;
  tags: number[];
  created: string;
  created_date: string;
  modified: string;
  added: string;
  deleted_at: string;
  archive_serial_number: number;
  original_file_name: string;
  archived_file_name: string;
  owner: number;
  user_can_change: boolean;
  is_shared_by_requester: boolean;
  notes: string[];
  custom_fields: string[];
};

export type WhishperRecordingType = {
  id: string;
  status: number;
  language: string;
  modelSize: string;
  task: string;
  device: string;
  fileName: string;
  sourceUrl: string;
  result: {
    language: string;
    duration: number;
    segments: {
      end: number;
      id: string;
      start: number;
      score: number;
      text: string;
      words: {
        end: number;
        start: number;
        word: string;
        score: number;
      }[];
    }[];
    text: string;
  };
  translations: Translation[];
};

type Translation = {
  sourceLanguage: string;
  targetLanguage: string;
  text: string;
  segments: [];
};

export type SimpleWhishperTranscription = {
  id: string;
  duration: number;
  name: string;
};

export type AdviceAPIType = {
  slip: {
    slip_id: number;
    advice: string;
  };
};
