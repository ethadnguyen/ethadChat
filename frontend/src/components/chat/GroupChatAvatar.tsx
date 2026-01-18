import type { Participant } from '@/types/chat/chat';
import UserAvatar from './UserAvatar';
import { Ellipsis } from 'lucide-react';

interface IGroupChatAvatarProps {
  participants: Participant[];
  type: 'sidebar' | 'chat';
}

const GroupChatAvatar = ({ participants, type }: IGroupChatAvatarProps) => {
  const limit = Math.min(participants.length, 4);
  const avatars = participants
    .slice(0, limit)
    .map((member) => (
      <UserAvatar
        key={member._id}
        name={member.displayName}
        avatarUrl={member.avatarUrl ?? undefined}
        type={type}
      />
    ));

  return (
    <div className='relative flex -space-x-2 *:data-[slot=avatar]:ring-background *:data-[slot=avatar]:ring=2'>
      {avatars}
      {participants.length > 4 && (
        <div className='flex items-center z-10 justify-center size-8 rounded-full bg-muted ring-2 ring-background text-muted-foreground'>
          <Ellipsis className='size-4' />
        </div>
      )}
    </div>
  );
};

export default GroupChatAvatar;
