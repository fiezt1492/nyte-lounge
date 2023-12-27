import { DataConnection } from 'peerjs'
import { atom } from 'recoil'

export type PeerStates = {
    connected: boolean
    roomConnected: boolean
    username?: string
    peerId?: string
    connections: DataConnection[]
    hostId?: string
    isHost: boolean
    joining: boolean
    mode?: ConnectMode
    messages: ChatMessage[]
}

const initialStates: PeerStates = {
    connected: false,
    roomConnected: false,
    connections: [],
    isHost: false,
    joining: false,
    messages: [],
}

export const peerStates = atom({
    key: 'PeerConnectionStates',
    default: initialStates,
})
