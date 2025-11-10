import type { Language, Conversation } from '../../shared/types';

export interface ChatbotPopupProps {
  open: boolean;
  onClose: () => void;
  currentLanguage: Language;
  userId: string;
}

export interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete?: (id: string) => void;
}
