import Footer from './MainComponents/footer';
import { MessageCircle } from 'lucide-react';
import Header from './MainComponents/header';

export default function ChatsPage({ onNavigate,user }) {
  const chats = [
    { id: 1, name: 'Alice Johnson', lastMessage: 'Let’s meet at 5!', time: '2m ago', unread: 2, avatar: '👩‍💼' },
    { id: 2, name: 'Project Team', lastMessage: 'Final draft sent', time: '1h ago', unread: 0, avatar: '👥' },
    { id: 3, name: 'Bob Smith', lastMessage: 'Sounds good!', time: '3h ago', unread: 1, avatar: '👨‍💻' },
    { id: 3, name: 'Bob Smith', lastMessage: 'Sounds good!', time: '3h ago', unread: 1, avatar: '👨‍💻' },
    { id: 3, name: 'Bob Smith', lastMessage: 'Sounds good!', time: '3h ago', unread: 1, avatar: '👨‍💻' },
    { id: 3, name: 'Bob Smith', lastMessage: 'Sounds good!', time: '3h ago', unread: 1, avatar: '👨‍💻' },
    { id: 3, name: 'Bob Smith', lastMessage: 'Sounds good!', time: '3h ago', unread: 1, avatar: '👨‍💻' },
    { id: 3, name: 'Bob Smith', lastMessage: 'Sounds good!', time: '3h ago', unread: 1, avatar: '👨‍💻' },
    { id: 3, name: 'Bob Smith', lastMessage: 'Sounds good!', time: '3h ago', unread: 1, avatar: '👨‍💻' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900">
      {/* Header */}
      <Header user={user}/>

      {/* Chat list */}
      <div className="divide-y divide-white/10">
        {chats.map(chat => (
          <div
            key={chat.id}
            className="px-6 py-4 hover:bg-white/5 cursor-pointer flex justify-between items-center"
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl">{chat.avatar}</div>
              <div>
                <h3 className="text-white font-medium">{chat.name}</h3>
                <p className="text-white/60 text-sm truncate">{chat.lastMessage}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white/50 text-xs mb-1">{chat.time}</p>
              {chat.unread > 0 && (
                <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                  {chat.unread}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
