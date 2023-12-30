import React from 'react'
import ChatInput from './ChatInput'
import { Separator } from '@/components/ui/separator'
import Messages from './Messages'
import { useRecoilState } from 'recoil'
import { peerStates } from '@/lib/atoms/PeerAtom'
import { WifiOff } from 'lucide-react'

function ChatBox() {
    const [peerStatesValue, setPeerStates] = useRecoilState(peerStates)
    const {
        connected,
        roomConnected,
        username,
        isHost,
        hostId,
        mode,
        connections,
    } = peerStatesValue

    return (
        <div className="flex flex-col h-full justify-center">
            {roomConnected ? (
                <>
                    <Messages />
                    <Separator className="my-4" />
                    <ChatInput />
                </>
            ) : (
                <div className="flex items-center justify-center space-x-2">
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
