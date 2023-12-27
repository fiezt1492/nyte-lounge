import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { peerStates } from '@/lib/atoms/PeerAtom'
import React, { useState } from 'react'
import { useSetRecoilState } from 'recoil'

function ChatInput() {
    const setState = useSetRecoilState(peerStates)
    const [message, setMessage] = useState<string>('')

    return (
        <form
            className="flex w-full items-center space-x-2"
            onSubmit={(e) => {
                e.preventDefault()
                if (message)
                    setState((state) => ({
                        ...state,
                        messages: [
                            ...state.messages,
                            {
                                author: 'Shit',
                                timestamp: Date.now(),
                                type: 'text',
                                message,
                            },
                        ],
                    }))
                setMessage('')
            }}
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
