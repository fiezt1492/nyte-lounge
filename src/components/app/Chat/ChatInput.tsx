import { usePeerService } from '@/components/providers/PeerProvider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { peerStates } from '@/lib/atoms/PeerAtom'
import React, { useState } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { toast } from 'sonner'

function ChatInput() {
    const peerService = usePeerService()
    const [states, setStates] = useRecoilState(peerStates)
    const { messages, peerId } = states
    const [message, setMessage] = useState<string>('')

    const sendMessage = (e: any) => {
        e.preventDefault()
        if (!message || message.trim() === '') {
            return toast.error('Please enter message')
        } else {
            const newMessage: ChatMessage = {
                author: peerId!,
                message,
                timestamp: new Date().getTime(),
                type: 'text',
            }
            peerService?.sendAll({
                action: 'newMessage',
                data: newMessage,
            })
            setStates((state) => ({
                ...state,
                messages: [...messages, newMessage],
            }))
            setMessage('')
        }
    }

    return (
        <form
            className="flex w-full items-center space-x-2"
            onSubmit={sendMessage}
        >
            <Input
                name="message"
                type="text"
                placeholder="type something..."
                onChange={(e) => setMessage(e.target.value)}
                value={message}
            />
            <Button type="submit">Send</Button>
        </form>
    )
}

export default ChatInput
