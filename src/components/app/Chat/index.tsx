import React from 'react'
import ChatInput from './ChatInput'
import { Separator } from '@/components/ui/separator'
import Messages from './Messages'

function ChatBox() {
    return (
        <div className="flex flex-col h-full justify-center p-4">
            <Messages />
            <Separator className="my-4" />
            <ChatInput />
        </div>
    )
}

export default ChatBox
