import Player from '@/components/app/Player'
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
            <ResizablePanel defaultSize={50}>
                <ResizablePanelGroup direction="vertical">
                    <ResizablePanel defaultSize={50}>
                        <Player />
                    </ResizablePanel>
                    <ResizableHandle />
                    <ResizablePanel defaultSize={50}>
                        {isClient && <ChatBox />}
                    </ResizablePanel>
                </ResizablePanelGroup>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={30}>
                <Searcher />
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}
