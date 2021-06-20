import { Router } from 'express'
import { CustomRequest } from '../Declarations/CustomReqest';
import { HttpError } from '../Errors/HttpError';
import { CertificateService } from '../Services/CertificateService';

export const automatedCertificateRoute = Router();

automatedCertificateRoute.post('/register', async (req: CustomRequest, res: any, next: any) => {
    const log = req.log
    try {        
        const data = req.body
        await CertificateService.initchallenge(data.certificateDetails, data.csrRequest)
        return res.status(201).json({ 'message': 'Created Certificate Draft, waiting for validation' })
    } catch (error) {
        log.error(error)
        next(error)
    }
})