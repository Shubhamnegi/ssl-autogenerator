import { HaProxyGroupsInterface } from "../Declarations/HaProxyGroupsInterface";
import { HaProxyGroups } from "../Models/HaProxyGroups";

export class HaProxyGroupsRepository {
    /**
     * To get all posible ips from group
     * @param group_type 
     * @returns 
     */
    public static async getListOfIpsForHaProxyGroup(group_type: string) {
        const result = await HaProxyGroups.findAll({
            where: { group_type }
        });
        return result.map(x => x.toJSON()) as HaProxyGroupsInterface[];
    }
}