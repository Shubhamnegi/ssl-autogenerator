export interface AutomatedCertificate {
    id?: number;
    domainName: string,
    brandId: string,
    certificateHash: string,
    challengeFilePath?: string,
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
    brandId: string,
    issuer: string,
    domainType: string
}