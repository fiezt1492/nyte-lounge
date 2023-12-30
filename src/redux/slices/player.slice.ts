import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { enqueueTrack } from '@/redux/actions/player.actions'
import { RootState, store } from '@/redux/store'
import { toast } from 'sonner'

export interface PlayerSliceState {
    track: YouTubeTrack | null
    paused: boolean
    currentTime: number
    shouldUpdateBySeek: boolean
    loading: boolean
    volumeLevel: number
}

const initialState: PlayerSliceState = {
    track: null,
    paused: false,
    currentTime: 0,
    shouldUpdateBySeek: false,
    loading: true,
    volumeLevel: 100,
}

const playerSlice = createSlice({
    name: 'player',
    initialState,
    reducers: {
        setPlayer(state, action: PayloadAction<Optional<PlayerSliceState>>) {
            return {
                ...state,
                ...action.payload,
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(enqueueTrack.fulfilled, (state, action) => {
                state.track = action.payload.track

                toast.success('Added to queue')

                return state
            })
            .addCase(enqueueTrack.rejected, (state, action) => {
                toast.error(action.error.message || 'Failed to enqueue')
            })
    },
})

export const { setPlayer } = playerSlice.actions

export default playerSlice
