import React from 'react'
import ChatInput from './ChatInput'
import { Separator } from '@/components/ui/separator'
import Messages from './Messages'
import { WifiOff } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'

function ChatBox() {
    const dispatch = useAppDispatch()
    const {
        showDrawer,
        connected,
        roomConnected,
        username,
        isHost,
        hostId,
        mode,
        connections,
    } = useAppSelector((state) => state.connect)

    return (
        <div className="h-full">
            {roomConnected ? (
                <div className="flex flex-col h-full justify-center">
                    <span>Participants {connections.length}</span>
                    <Separator className="mt-2" />
                    <Messages />
                    <Separator className="mb-4" />
                    <ChatInput />
                </div>
            ) : (
                <div className="flex items-center justify-center space-x-2 h-full">
                    <WifiOff />
                    <span className="scroll-m-20 text-xl font-semibold tracking-tight">
                        {' '}
                        You are not connected to any room.
                    </span>
                </div>
            )}
        </div>
    )
}

export default ChatBox
