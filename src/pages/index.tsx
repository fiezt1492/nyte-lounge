import ChatBox from '@/components/app/Chat'
import ConnectPanel from '@/components/app/Menu'
import AudioControl from '@/components/app/Player/AudioControl'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable'

export default function Home() {
    return (
        <ResizablePanelGroup direction="horizontal" className={`min-h-screen`}>
            <ResizablePanel defaultSize={20}>
                <ConnectPanel />
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
                        <ChatBox />
                    </ResizablePanel>
                </ResizablePanelGroup>
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}
