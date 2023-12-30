import { Separator } from '@/components/ui/separator'
import RoomControl from './RoomControl'
import Status from './Status'
import ChatBox from '../Chat'
import { useAppSelector } from '@/redux/hooks'

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
        <div className="flex flex-col h-full p-6 space-y-4">
            <Status />
            <Separator />
            <RoomControl />
            {roomConnected && <span>Participants {connections.length}</span>}
            <Separator />
            <ChatBox />
        </div>
    )
}

export default Menu
