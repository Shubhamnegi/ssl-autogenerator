export interface AutomatedCertificate {
    id?: number;
    domainName: string,
    certificateHash: string,
    challangeFilePath?: string,
    certificateKeyPath?: string,
    certificateCrtPath?: string,
    certificateCaBundlePath?: string,
    csrMeta?: string,
    expiryDate?: Date,
    autoRenewedOn?: Date,
    issuer: string,
    domainType: string,
    createdAt?: Date,
    updatedAt?: Date,
}

export interface AutomatedCertificateRequest {
    domainName: string,
    issuer: string,
    domainType: string
}