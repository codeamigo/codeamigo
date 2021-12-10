export interface CodeSandboxI {
  data: {
    modules: {
      code: string;
      directory_shortid: string;
      id: string;
      inserted_at: string;
      is_binary: boolean;
      sha: null | string;
      shortid: string;
      source_id: string;
      title: string;
      updated_at: string;
      upload_id: null | string;
    }[];
    directories: {
      directory_shortid: string;
      id: string;
      inserted_at: string;
      shortid: string;
      source_id: string;
      title: string;
      updated_at: string;
    }[];
    is_sse: true;
    entry: string;
  };
}
