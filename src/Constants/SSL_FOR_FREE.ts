import path from 'path'
export const SSLFORFREE = {
    apikey: process.env.SSLFORFREE_API_KEY as string,
    baseurl: process.env.BASE_URL as string,
    defaultCertificateValidity: 90
}

export const tempDir = path.join(__dirname, "\\..\\..\\temp");