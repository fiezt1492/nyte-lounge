import { ScrollArea } from '@/components/ui/scroll-area'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setConnectSlice } from '@/redux/slices/connect.slice'
import React, { useEffect, useRef } from 'react'

function Messages() {
    const dispatch = useAppDispatch()
    const { messages, peerId } = useAppSelector((state) => state.connect)
    const ref = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        if (ref.current) ref.current.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()

        if (messages.length > 20) {
            let last50Messages = messages.slice(-50)
            dispatch(
                setConnectSlice({
                    messages: last50Messages,
                })
            )
        }
    }, [messages])

    return (
        <ScrollArea className="flex-1 w-full">
            <ul>
                {messages.map((v) => (
                    <div
                        key={`${v.author}_${v.timestamp}`}
                        title={`${new Date(v.timestamp)}`}
                        className="min-w-0"
                    >
                        {v.author}: {v.message}
                    </div>
                ))}
                <div ref={ref}></div>
            </ul>
        </ScrollArea>
    )
}

export default Messages
