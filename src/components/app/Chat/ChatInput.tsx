import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setConnectSlice } from '@/redux/slices/connect.slice'
import peerService from '@/services/peer.service'
import React, { useState } from 'react'
import { toast } from 'sonner'

function ChatInput() {
    const dispatch = useAppDispatch()
    const { messages, peerId } = useAppSelector((state) => state.connect)
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
            peerService.sendAll({
                action: 'newMessage',
                data: newMessage,
            })
            dispatch(
                setConnectSlice({
                    messages: [...messages, newMessage],
                })
            )
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
