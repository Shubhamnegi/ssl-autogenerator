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

automatedCertificateRoute.post('/renew', async (req: CustomRequest, res: any, next: any) => {
    const log = req.log
    try {
        await CertificateService.initRenewal()
        return res.status(200).json({ 'message': 'Triggered renewal' })
    } catch (error) {
        log.error(error)
        next(error)
    }
})