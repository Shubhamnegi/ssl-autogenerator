import { AutomatedCertificate as AutomatedCertificateInteface } from "../Declarations/AutomatedCertificateInterface";
import { CertificateNotFound } from "../Errors/CertificateNotFound";
import { AutomatedCertificates } from "../Models/AutomatedCertificates";

export class AutomatedCertificatesRepository {
    /**
     * To get certificate by hash or certificate id stored in 3p
     * @param certificateHash 
     */
    public static async getCertificateByHash(certificateHash: string) {
        const result = await AutomatedCertificates.findOne({
            where: { certificateHash }
        })
        if (!result) {
            throw new CertificateNotFound(certificateHash);
        }
        return result.toJSON() as AutomatedCertificateInteface
    }
}