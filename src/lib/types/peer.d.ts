type ConnectMode = 'group' | 'broadcast'

type ChatMessage = {
    author: string
    message: string
    timestamp: number
    type: 'text' | 'image' | 'attachment'
}
