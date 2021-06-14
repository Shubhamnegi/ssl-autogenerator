import { SSLFORFREE } from "../Constants/SSL_FOR_FREE"
import * as axios from 'axios';
import { CertificateResult, SearchCertificateResponse } from "../Declarations/SearchCertificateResponse";
import { getcsr } from "../Helpers/csrHelper";
import { CsrRequest } from "../Declarations/CsrRequest";
import Logger from "bunyan";
import { getLogger } from "../Helpers/logger";
import { formUrlEncoded } from "../Helpers/util";

export class SslForFree {
    private apiKey: string;
    private baseurl: string;
    private domain: string;
    private validity: number;
    private logger: Logger;

    constructor(domain: string) {
        this.apiKey = SSLFORFREE.apikey
        this.baseurl = SSLFORFREE.baseurl
        this.validity = SSLFORFREE.defaultCertificateValidity;
        this.domain = domain;
        this.logger = getLogger("SslForFree").child({ domain });
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

    /**
     * To create new csr request
     * @param csrRequest 
     * @returns 
     */
    async createCertificate(
        csrRequest: CsrRequest
    ): Promise<axios.AxiosResponse<CertificateResult>> {
        const ep = "/certificates";
        const postData = {
            certificate_domains: this.domain,
            certificate_validity_days: this.validity,
            certificate_csr: getcsr(csrRequest)
        };

        this.logger.debug({ ep, postData })

        const result = await axios.default({
            url: this.baseurl + ep,
            params: { access_key: this.apiKey },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: formUrlEncoded(postData)
        });

        return result;
    }
}


