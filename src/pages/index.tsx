import Player from '@/components/app/Player'
import Searcher from '@/components/app/Searcher'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable'
import { ScrollArea } from '@/components/ui/scroll-area'
import { lazy, useEffect, useState } from 'react'

const ConnectPanel = lazy(() => import('@/components/app/Menu'))

export default function Home() {
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    return (
        <ResizablePanelGroup direction="horizontal" className={`min-h-dvh`}>
            <ResizablePanel defaultSize={20}>
                {isClient && <ConnectPanel />}
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={40}>
                <Player />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={40}>
                <Searcher />
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}
