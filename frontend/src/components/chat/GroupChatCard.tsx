import type { Conversation } from '@/types/chat/chat';
import { useAuthStore } from '@/stores/useAuthStore';
import { useChatStore } from '@/stores/useChatStore';
import ChatCard from './ChatCard';
import { cn } from '@/lib/utils';
import UnreadCountBadge from './UnreadCountBadge';
import GroupChatAvatar from './GroupChatAvatar';

const GroupChatCard = ({ convo }: { convo: Conversation }) => {
  const { user } = useAuthStore();
  const {
    activeConversationId,
    setActiveConversationId,
    messages,
    fetchMessages,
  } = useChatStore();

  if (!user) return null;

  const unreadCount = convo.unreadCounts[user._id] || 0;
  const name = convo.group?.name ?? '';
  const handleSelectConversation = async (id: string) => {
    setActiveConversationId(id);
    if (!messages[id]) {
      await fetchMessages();
    }
  };

  return (
    <ChatCard
      convoId={convo._id}
      name={name}
      timestamp={
        convo.lastMessage?.createdAt
          ? new Date(convo.lastMessage.createdAt)
          : undefined
      }
      isActive={activeConversationId === convo._id}
      onSelect={handleSelectConversation}
      unreadCount={unreadCount}
      leftSection={
        <>
          {/* unread count */}
          {unreadCount > 0 && <UnreadCountBadge unreadCount={unreadCount} />}
          {/* group avatar */}
          <GroupChatAvatar participants={convo.participants} type='chat' />
        </>
      }
      subtitle={
        <p className={cn('text-sm truncate text-muted-foreground')}>
          {convo.participants.length} thành viên
        </p>
      }
    />
  );
};

export default GroupChatCard;
