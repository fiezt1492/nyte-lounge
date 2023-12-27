import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useState } from 'react'
import { Switch } from '@/components/ui/switch'

function RoomControl() {
    const [roomMode, setRoomMode] = useState<ConnectMode>('broadcast')

    return (
        <div>
            <Tabs defaultValue="joinRoom">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="joinRoom">Join</TabsTrigger>
                    <TabsTrigger value="createRoom">Create</TabsTrigger>
                </TabsList>
                <TabsContent value="joinRoom">
                    <Card>
                        <CardContent className="pt-4">
                            <div className="space-y-1">
                                <Label htmlFor="username">
                                    {`Join a room by connect to host's ID.`}
                                </Label>
                                <div className="flex space-x-2">
                                    <Input
                                        id="username"
                                        placeholder={`host's peer id`}
                                    />
                                    <Button>Join</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="createRoom">
                    <Card>
                        <CardContent className="pt-4">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="roomMode"
                                        onCheckedChange={(e) =>
                                            setRoomMode(
                                                e ? 'broadcast' : 'group'
                                            )
                                        }
                                        checked={roomMode === 'broadcast'}
                                    />
                                    <Label htmlFor="roomMode">{`${roomMode
                                        .charAt(0)
                                        .toLocaleUpperCase()}${roomMode.slice(
                                        1
                                    )}`}</Label>
                                </div>
                                <Button>Create</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default RoomControl
