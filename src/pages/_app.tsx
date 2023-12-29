import AppLayout from '@/components/layouts/AppLayout'
import PlayerLayout from '@/components/layouts/PlayerLayout'
import { Toaster } from '@/components/ui/sonner'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { RecoilRoot } from 'recoil'
import { RecoilTunnel } from 'recoil-toolkit'

export default function App({ Component, pageProps }: AppProps) {
    return (
        <RecoilRoot>
            <RecoilTunnel />
            <AppLayout>
                <PlayerLayout>
                    <Component {...pageProps} />
                </PlayerLayout>
            </AppLayout>
            <Toaster />
        </RecoilRoot>
    )
}
