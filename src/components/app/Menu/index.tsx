import { Separator } from '@/components/ui/separator'
import { peerStates } from '@/recoil/atoms/PeerAtom'
import { useRecoilState } from 'recoil'
import RoomControl from './RoomControl'
import Status from './Status'
import ChatBox from '../Chat'

function Menu() {
    const [peerStatesValue, setPeerStates] = useRecoilState(peerStates)
    const {
        connected,
        roomConnected,
        username,
        isHost,
        hostId,
        mode,
        connections,
    } = peerStatesValue

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
