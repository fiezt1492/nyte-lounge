import AudioControl from '@/components/app/Player/AudioControl'
import Searcher from '@/components/app/Searcher'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable'
import dynamic from 'next/dynamic'
import { lazy, useEffect, useState } from 'react'

const ConnectPanel = dynamic(() => import('@/components/app/Menu'), {
    ssr: false,
})
const ChatBox = dynamic(() => import('@/components/app/Chat'), {
    ssr: false,
})

export default function Home() {
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    return (
        <ResizablePanelGroup direction="horizontal" className={`min-h-screen`}>
            <ResizablePanel defaultSize={20}>
                {isClient && <ConnectPanel />}
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={60}>
                <ResizablePanelGroup direction="vertical">
                    <ResizablePanel defaultSize={50}>
                        <div className="flex h-full items-center justify-center p-6">
                            <AudioControl />
                            <span className="font-semibold">Player</span>
                        </div>
                    </ResizablePanel>
                    <ResizableHandle />
                    <ResizablePanel defaultSize={50}>
                        {isClient && <ChatBox />}
                    </ResizablePanel>
                </ResizablePanelGroup>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={20}>
                <Searcher />
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}
