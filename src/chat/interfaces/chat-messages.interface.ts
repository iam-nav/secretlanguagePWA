export interface ChatMessagesInterface {
  id: number;
  content: [
    {
      type: string;
      message: string;
    },
  ];
  type: string;
  user: {
    id: number;
    name: string;
    image: string;
  };
  read: boolean;
  created_at: string;
}
