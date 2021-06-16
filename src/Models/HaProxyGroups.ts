import { DataTypes } from "sequelize";
import { Mysql } from "../Connections/mysql";

const sequelize = Mysql.getConnection();

export const HaProxyGroups = sequelize.define('HaProxyGroups', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "ha_proxy_group_id"
    },
    groupType: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "group_type"
    },
    groupName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "group_name"
    },
    groupId: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "group_id"
    },
    groupAvailabilityZone: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "group_availability_zone"
    },
    groupInstanceIp: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "group_instance_ip"
    },
    challengeQueue: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "challenge_queue"
    },
    certificateQueue: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "certificate_queue"
    },
    createdAt: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "created_at"
    },
    updatedAt: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "updated_at"
    }
}, {
    tableName: "ha_proxy_groups"
});
