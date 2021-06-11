import { SSLFORFREE } from "../Constants/SSL_FOR_FREE"
import * as axios from 'axios';
import { CertificateResult, SearchCertificateResponse } from "../Declarations/SearchCertificateResponse";

export class SslForFree {
    private apiKey: string;
    private baseurl: string;
    private domain: string

    constructor(domain: string) {
        this.apiKey = SSLFORFREE.apikey
        this.baseurl = SSLFORFREE.baseurl
        this.domain = domain;
    }

    /**
     * To get list of certificates
     * @param certificate_status 
     * @param page 
     * @param limit 
     */
    async searchCertificate(
        certificate_status: CERTIFICATE_STATUS,
        page = 1,
        limit = 10
    ): Promise<axios.AxiosResponse<SearchCertificateResponse>> {
        const ep = "/certificates"
        const result: axios.AxiosResponse<SearchCertificateResponse> = await axios.default.get(this.baseurl + ep, {
            params: {
                access_key: this.apiKey,
                certificate_status,
                search: this.domain,
                limit,
                page
            }
        });
        return result;
    }

    /**
     * To get details of a certificate
     * @param id 
     */
    async getCertificate(
        id: string
    ): Promise<axios.AxiosResponse<CertificateResult>> {
        const ep = "/certificates/" + id
        const result = await axios.default(
            this.baseurl + ep,
            {
                params: { access_key: this.apiKey }
            }
        )
        return result;
    }
}


