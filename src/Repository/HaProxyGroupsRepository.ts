import { HaProxyGroupsInterface } from "../Declarations/HaProxyGroupsInterface";
import { HaProxyGroups } from "../Models/HaProxyGroups";

export class HaProxyGroupsRepository {
    /**
     * To get all posible ips from group
     * @param groupId 
     * @returns 
     */
    public static async getListOfIpsForHaProxyGroup(groupName: string) {
        const result = await HaProxyGroups.findAll({
            where: { groupName }
        });
        return result.map(x => x.toJSON()) as HaProxyGroupsInterface[];
    }
}