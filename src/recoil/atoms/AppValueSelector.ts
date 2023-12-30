import { selector } from 'recoil'
import { PeerStates, peerStates } from './PeerAtom'
import { PlayerStates, playerStates } from './PlayerAtom'

export type AppStates = {
    peer: PeerStates
    player: PlayerStates
}

export const appStatesValue = selector<AppStates>({
    key: 'AppStatesValue',
    get: ({ get }) => {
        const peer = get(peerStates)
        const player = get(playerStates)

        return {
            peer,
            player,
        }
    },
})
