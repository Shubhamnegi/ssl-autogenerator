import { DataTypes } from "sequelize";
import { Mysql } from "../Connections/mysql";

const sequelize = Mysql.getConnection();

export const AutomatedCertificates = sequelize.define('AutomatedCertificates', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    domainName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    certificateHash: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    challangeFilePath: {
        type: DataTypes.STRING,
    },
    certificateKeyPath: {
        type: DataTypes.STRING,
    },
    certificateCrtPath: {
        type: DataTypes.STRING,
    },
    certificateCaBundlePath: {
        type: DataTypes.STRING,
    },
    csrMeta: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    expiryDate: {
        type: DataTypes.DATE
    },
    autoRenewedOn: {
        type: DataTypes.DATE
    },
    issuer: {
        type: DataTypes.STRING,
        allowNull: false
    },
    domainType: {
        type: DataTypes.ENUM,
        values: ['internal', 'external']
    }
}, {
    tableName: "automated_certificates",
    createdAt: true,
    updatedAt: true,
    indexes: [{
        name: 'certificateHash_idx',
        using: 'BTREE',
        fields: ['certificateHash']
    }, {
        name: 'expiryDate_idx',
        using: 'BTREE',
        fields: ['expiryDate']
    }, {
        name: 'domainName_idx',
        using: "BTREE",
        fields: ['domainName']
    }]
});
