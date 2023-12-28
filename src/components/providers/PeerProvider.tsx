import { playerEl } from '@/components/providers/PlayerProvider'
import { appStatesValue } from '@/lib/atoms/AppValueSelector'
import { peerStates } from '@/lib/atoms/PeerAtom'
import { PlayerStates, playerStates } from '@/lib/atoms/PlayerAtom'
import peerService from '@/lib/services/peer.service'
import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { getRecoil, setRecoil } from 'recoil-nexus'
import { toast } from 'sonner'
import { generateUsername } from 'unique-username-generator'

interface PeerProviderProps {}

export default function PeerProvider({}: PeerProviderProps) {
    const [peerStatesValue, setPeerStates] = useRecoilState(peerStates)
    const { connections, isHost, roomConnected, mode } = peerStatesValue
    const [playerStatesValue, setPlayerStates] = useRecoilState(playerStates)
    const { track, currentTime, paused } = playerStatesValue

    useEffect(() => {
        const username = generateUsername('-')
        peerService.initialize(username).then((id) => {
            setPeerStates((state) => ({
                ...state,
                connected: true,
                username,
                peerId: id,
            }))
        })

        peerService.onData.addListener((data, conn) => {
            const appStates = getRecoil(appStatesValue)
            if (data.action === 'hostCheck' && appStates.peer.joining) {
                if (data.data.isHost === true) {
                    setRecoil(peerStates, (state) => ({
                        ...state,
                        roomConnected: true,
                        hostId: conn.peer,
                        mode: data.data.mode,
                    }))
                    return toast.success('Connected!')
                } else if (!appStates.peer.isHost) {
                    if (!appStates.peer.roomConnected) {
                        // when user is trying to connect to a non-host client when not in the room
                        // then disconnect that connection since it's useless
                        conn.close()
                        return toast.error('Peer seems not a valid room.')
                    }
                }
            }
            if (data.action === 'syncPlayer') {
                setRecoil(playerStates, (state) => ({
                    ...state,
                    track: data.data.url || appStates.player.track,
                    paused: data.data.paused || appStates.player.paused,
                }))
            }
            if (data.action === 'seek' && playerEl) {
                playerEl.currentTime = data.data
            }
            if (data.action === 'requestPeers') {
                peerService.send(conn, {
                    action: 'peersUpdate',
                    data: appStates.peer.connections.map((conn) => conn.peer),
                })
            }
            if (data.action === 'peersUpdate') {
                // list of peers' username
                const peersList = data.data
                for (let peer of peersList) {
                    if (
                        !appStates.peer.connections.find((x) => x.peer === peer)
                    ) {
                        // connect to peer since he is not in our list
                        peerService.connect(peer).then(() => null)
                    }
                }
            }
            if (data.action === 'newMessage') {
                setRecoil(peerStates, (state) => ({
                    ...state,
                    messages: [...appStates.peer.messages, data.data],
                }))
            }
        })
        peerService.onConnection.addListener((conn) => {
            const appStates = getRecoil(appStatesValue)
            peerService.send(conn, {
                action: 'hostCheck',
                data: {
                    isHost: appStates.peer.isHost,
                    mode: appStates.peer.mode,
                },
            })
            setRecoil(peerStates, (state) => ({
                ...state,
                connections: [conn, ...appStates.peer.connections],
            }))
            if (!appStates.peer.isHost) {
                // request peers update
                peerService.send(conn, {
                    action: 'requestPeers',
                })
            } else {
                // notice other peers that someone has just joined
            }
        })

        peerService.onClose.addListener((conn) => {
            const appStates = getRecoil(appStatesValue)
            setRecoil(peerStates, (state) => ({
                ...state,
                connections: appStates.peer.connections.filter(
                    (x) => x.connectionId !== conn.connectionId
                ),
            }))
        })

        return () => {
            setPeerStates((state) => ({
                ...state,
                roomConnected: false,
                connections: [],
            }))
            peerService.disconnect()
        }
    }, [])

    useEffect(() => {
        if (
            roomConnected &&
            ((mode === 'broadcast' && isHost) || mode === 'group')
        ) {
            const syncData: Optional<PlayerStates> = {
                track: track,
            }

            peerService.sendAll({
                action: 'syncPlayer',
                data: syncData,
            })
        }
    }, [track, paused])

    return <></>
}
