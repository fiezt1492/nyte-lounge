import { selector } from 'recoil'
import { peerStates } from './PeerAtom'
import { playerStates } from './PlayerAtom'

export const appStatesValue = selector({
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
