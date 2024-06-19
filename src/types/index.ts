export type PaperlessDocumentsType = {
    data: {
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
  };