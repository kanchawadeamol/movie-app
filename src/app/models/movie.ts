export interface RequestTokenInterface {
  expires_at: string;
  request_token: string;
}

export interface SessionIdInterface {
  success: boolean;
  session_id: string;
}
