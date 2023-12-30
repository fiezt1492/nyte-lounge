import { createAsyncThunk } from '@reduxjs/toolkit'
import { RootState, store } from '@/redux/store'
import { toast } from 'sonner'

interface EnqueueTrackArgs {
    track: YouTubeTrack
    playNow: boolean
}

export const enqueueTrack = createAsyncThunk(
    'app/enqueue-track',
    (data: EnqueueTrackArgs, thunkAPI) => {
        const {
            connect,
            player: { track },
        } = thunkAPI.getState() as RootState
        if (
            connect.roomConnected &&
            !connect.isHost &&
            connect.mode === 'broadcast'
        ) {
            toast.error(`You're in a broadcast room so you cannot play a track`)
            throw new Error('Broadcast enqueue prohibited')
        }
        if (track && track.id === data.track.id)
            throw new Error('This track is playing...')
        return data
    }
)
