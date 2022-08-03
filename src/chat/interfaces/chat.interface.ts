export interface ChatInterface {
  id: number;
  chatName: string;
  image: string;
  read: boolean;
  message: {
    id: number;
    content: [
      {
        type: string;
        message: string;
      },
    ];
    type: string;
    created_at: string;
  };
}
