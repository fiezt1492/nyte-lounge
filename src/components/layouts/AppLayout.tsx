import { ReactNode } from 'react'
import PlayerProvider from '@/components/providers/PlayerProvider'

interface AppLayoutProps {
    children: ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
    return (
        <PlayerProvider>
            <div>{children}</div>
        </PlayerProvider>
    )
}
