import ChatBox from '@/components/app/Chat'
import AudioControl from '@/components/app/Player/AudioControl'
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
            <ResizablePanel defaultSize={80}>
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
        </ResizablePanelGroup>
    )
}
