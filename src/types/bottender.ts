/**
 * bottender context
 */
export interface Context {
  sendText: (message: string, options?: any) => Promise<void>;
  event: {
    isText: boolean;
    text: string;
    message: {
      message_id: string;
      text: string;
      from: {
        id: string;
        is_bot: boolean;
        first_name: string;
        username: string;
        language_code: string;
      };
    };
  };
}
