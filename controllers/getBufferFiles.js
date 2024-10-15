// RUN CHAT MEDIA
export const getBufferFiles = async (urlImage, mimeType) => {
    try {
        console.log('get buffer');
        
        const headers = new Headers(); headers.append('Accept', mimeType);
        const res = await fetch(urlImage, { headers })
        const data = await res.blob()
        const response = { inlineData: { data: Buffer.from(await data.arrayBuffer()).toString('base64'), mimeType, } };
        return response
    } catch (err) { return 'err' }
}