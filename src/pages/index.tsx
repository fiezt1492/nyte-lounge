import ChatBox from '@/components/app/Chat'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable'

export default function Home() {
    return (
        <ResizablePanelGroup direction="horizontal" className={`min-h-screen`}>
            <ResizablePanel defaultSize={20}>
                <div className="flex h-full items-center justify-center p-6">
                    <span className="font-semibold">Connect Panel</span>
                </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={80}>
                <ResizablePanelGroup direction="vertical">
                    <ResizablePanel defaultSize={50}>
                        <div className="flex h-full items-center justify-center p-6">
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
