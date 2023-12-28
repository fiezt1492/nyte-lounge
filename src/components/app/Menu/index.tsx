import { Separator } from '@/components/ui/separator'
import { peerStates } from '@/lib/atoms/PeerAtom'
import { useRecoilState } from 'recoil'
import RoomControl from './RoomControl'
import Status from './Status'

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
        </div>
    )
}

export default Menu
