import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { peerStates } from '@/lib/atoms/PeerAtom'
import { Zap, ZapOff } from 'lucide-react'
import { useRecoilValue } from 'recoil'
import { toast } from 'sonner'

function Status() {
    const { username, connected } = useRecoilValue(peerStates)
    const copy = () => {
        // TODO: Copy ID
        navigator.clipboard
            .writeText(username!)
            .then(() => toast.success('Copied'))
    }
    return (
        <div className="flex flex-col space-y-2">
            <div className="flex flex-row items-center justify-between">
                <label htmlFor="username">Peer ID</label>
                <Badge variant={connected ? 'outline' : 'secondary'}>
                    {connected ? <Zap size={'16'} /> : <ZapOff size={'16'} />}
                    <span className="ml-1">
                        {connected ? 'Connected' : 'Connecting...'}
                    </span>
                </Badge>
            </div>
            <div className="flex flex-row space-x-2">
                <Input disabled defaultValue={username} id="username" />
                <Button onClick={copy}>Copy</Button>
            </div>
        </div>
    )
}

export default Status
