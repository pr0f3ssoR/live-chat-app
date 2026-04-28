function saperate_chat (chats,chat_user_id){
    let oldChat = null
    let newChats = []
    chats.forEach(chat => {
        if (Number(chats.chat_user_id) === Number(chat_user_id)) oldChat = chat
        else newChats.push(chat)
    });
    if (oldChat){
        const updatedChat = {
        ...oldChat,
        unread: message.unread,
        last_message: {
            ...oldChat.last_message,
            text: message.text
  }
}
    }
}