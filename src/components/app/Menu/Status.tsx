import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { peerStates } from '@/lib/atoms/PeerAtom'
import { Zap, ZapOff } from 'lucide-react'
import React, { useEffect } from 'react'
import { useRecoilValue } from 'recoil'

function Status() {
    const state = useRecoilValue(peerStates)
    useEffect(() => {}, [])
    return (
        <div className="flex flex-col space-y-2">
            <div className="flex flex-row items-center justify-between">
                <label htmlFor="username">Peer ID</label>
                <Badge variant={state.connected ? 'outline' : 'secondary'}>
                    {state.connected ? (
                        <Zap size={'16'} />
                    ) : (
                        <ZapOff size={'16'} />
                    )}
                    <span className="ml-1">
                        {state.connected ? 'Connected' : 'Connecting...'}
                    </span>
                </Badge>
            </div>
            <div className="flex flex-row space-x-2">
                <Input disabled value={state.username} id="username" />
                <Button>Copy</Button>
            </div>
        </div>
    )
}

export default Status
