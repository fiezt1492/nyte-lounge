import { NextApiRequest, NextApiResponse } from 'next'
import { Innertube } from 'youtubei.js'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const youtube = await Innertube.create()
    const data = await youtube.getBasicInfo(req.body.id)
    res.json({
        data: data.basic_info,
    })
}
