import { ScrollArea } from '@/components/ui/scroll-area'
import { peerStates } from '@/lib/atoms/PeerAtom'
import React, { useEffect, useRef } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

function Messages() {
    const ref = useRef<HTMLDivElement>(null)
    const [state, setState] = useRecoilState(peerStates)

    const scrollToBottom = () => {
        if (ref.current) ref.current.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()

        if (state.messages.length > 20) {
            let last50Messages = state.messages.slice(-50)
            setState((state) => ({
                ...state,
                messages: last50Messages,
            }))
        }
    }, [state.messages])

    return (
        <ScrollArea className="flex-1 w-full">
            <ul>
                {state.messages.map((v) => (
                    <div
                        key={`${v.author}_${v.timestamp}`}
                        title={`${new Date(v.timestamp)}`}
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
