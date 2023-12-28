import dynamic from 'next/dynamic'
import { lazy, ReactNode, useEffect, useState } from 'react'

interface PlayerLayoutProps {
    children: ReactNode
}

const PeerProvider = dynamic(
    () => import('@/components/providers/PeerProvider'),
    { ssr: false }
)

export default function PlayerLayout({ children }: PlayerLayoutProps) {
    const [isClient, setIsClient] = useState(false)
    useEffect(() => {
        setIsClient(true)
    }, [])
    return (
        <>
            <div>{children}</div>
            {isClient && <PeerProvider />}
        </>
    )
}
