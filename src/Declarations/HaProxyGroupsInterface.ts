export interface HaProxyGroupsInterface {
    id?: number;
    groupType: string
    groupName: string
    groupId: string
    groupAvailabilityZone: string
    groupInstanceIp: string
    challengeQueue: string;
    certificateQueue: string;
    createdAt: Date
    updatedAt: Date
}