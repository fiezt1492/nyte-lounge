import React from 'react'
import Status from './Status'
import { useRecoilState } from 'recoil'
import { peerStates } from '@/lib/atoms/PeerAtom'
import { Separator } from '@/components/ui/separator'
import RoomControl from './RoomControl'

function Menu() {
    const [state, setState] = useRecoilState(peerStates)
    return (
        <div className="flex flex-col h-full p-6 space-y-4">
            <Status />
            <Separator />
            {state.connected && <RoomControl />}
            <span>Participants {state.connections.length}</span>
        </div>
    )
}

export default Menu
