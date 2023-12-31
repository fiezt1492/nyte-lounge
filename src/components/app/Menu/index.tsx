import { Separator } from '@/components/ui/separator'
import RoomControl from './RoomControl'
import Status from './Status'
import ChatBox from '../Chat'
import { useAppSelector } from '@/redux/hooks'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable'
import { ScrollArea } from '@/components/ui/scroll-area'

function Menu() {
    const {
        connected,
        roomConnected,
        username,
        isHost,
        hostId,
        mode,
        connections,
    } = useAppSelector((state) => state.connect)

    return (
        <div className="h-full">
            <ResizablePanelGroup direction="vertical" className={`h-full`}>
                <ResizablePanel defaultSize={35}>
                    <ScrollArea className="h-full">
                        <div className="p-6 space-y-2">
                            <Status />
                            <Separator />
                            <RoomControl />
                        </div>
                    </ScrollArea>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={65}>
                    <div className="h-full p-6">
                        <ChatBox />
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}

export default Menu
