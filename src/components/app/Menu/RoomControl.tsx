import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { peerStates } from '@/lib/atoms/PeerAtom'
import { ChevronDown, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useRecoilState } from 'recoil'
import { toast } from 'sonner'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { usePeerService } from '@/components/providers/PeerProvider'

const formSchema = z.object({
    username: z.string().min(2, {
        message: 'Peer ID must be at least 2 characters.',
    }),
})

function RoomControl() {
    const peerService = usePeerService()
    const [createMode, setCreateMode] = useState<ConnectMode>('broadcast')
    const [connecting, setConnecting] = useState(false)
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

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: '',
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        setConnecting(true)
        peerService
            ?.connect(values.username)
            .then((r: any) => {
                setPeerStates((state) => ({
                    ...state,
                    joining: true,
                }))
                setTimeout(() => {
                    setConnecting(false)
                }, 300)
            })
            .catch((e) => {
                setConnecting(false)
                return toast.error('Failed to connect')
            })
    }

    const createRoom = () => {
        setPeerStates((state) => ({
            ...state,
            roomConnected: true,
            isHost: true,
            mode: createMode,
        }))
    }

    return (
        <div>
            {roomConnected && !isHost && (
                <Collapsible>
                    <CollapsibleTrigger>
                        <div className="flex space-x-2">
                            <span>{`You're currently in a room`}</span>
                            <ChevronDown />
                        </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        {` You're currently in a room hosted by`} {hostId} this
                        is a {mode} room.{' '}
                        {mode === 'broadcast'
                            ? `You cannot control the queue (seek or navigate), however you still can pause the music.`
                            : `You can control the player (seek or navigate) as you like.`}
                    </CollapsibleContent>
                </Collapsible>
            )}
            {!roomConnected && (
                <Tabs defaultValue="joinRoom">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="joinRoom">Join</TabsTrigger>
                        <TabsTrigger value="createRoom">Create</TabsTrigger>
                    </TabsList>
                    <TabsContent value="joinRoom">
                        <Card>
                            <CardContent className="pt-4">
                                <Form {...form}>
                                    <form
                                        onSubmit={form.handleSubmit(onSubmit)}
                                    >
                                        <FormField
                                            control={form.control}
                                            name="username"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        {`Join a room by connect to host's peer ID.`}
                                                    </FormLabel>
                                                    <FormControl>
                                                        <div className="flex space-x-2">
                                                            <Input
                                                                required
                                                                placeholder={`host's peer ID...`}
                                                                {...field}
                                                            />
                                                            <Button
                                                                type="submit"
                                                                disabled={
                                                                    connecting
                                                                }
                                                            >
                                                                {connecting && (
                                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                )}
                                                                Join
                                                            </Button>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="createRoom">
                        <Card>
                            <CardContent className="pt-4 space-y-2">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="roomMode"
                                            onCheckedChange={(e) =>
                                                setCreateMode(
                                                    e ? 'broadcast' : 'group'
                                                )
                                            }
                                            checked={createMode === 'broadcast'}
                                        />
                                        <Label htmlFor="roomMode">{`${createMode
                                            .charAt(0)
                                            .toLocaleUpperCase()}${createMode.slice(
                                            1
                                        )}`}</Label>
                                    </div>
                                    <Button onClick={createRoom}>Create</Button>
                                </div>
                                <div>
                                    <>
                                        {createMode === 'broadcast' ? (
                                            <small>
                                                This mode prevent members from
                                                controlling the player.
                                            </small>
                                        ) : (
                                            <small>
                                                This mode allow members to
                                                control the player
                                                simultaneously.
                                            </small>
                                        )}
                                    </>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            )}
        </div>
    )
}

export default RoomControl
