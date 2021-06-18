import { NextActionEnum } from "../Constants/NextActionEnum";

export const delayedQueueFormatter = (certificateHash: string, nextAction: NextActionEnum) => {
    return { certificateHash, nextAction }
}