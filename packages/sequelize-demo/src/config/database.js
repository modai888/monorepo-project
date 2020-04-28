/**
 * Sequelize cli db config
 */
module.exports = {
    // 开发环境
    development: {
        username: 'dfroot',
        password: 'Q0k9Ka1858OW',
        database: 'df_sso_orm',
        host: '10.1.113.4',
        port: 33306,
        dialect: 'mysql',

        // Use a different table name. Default: SequelizeMeta
        migrationStorageTableName: 'sequelize_meta',
        seederStorageTableName: "sequelize_data"
    },

    // 生产环境
    production: {
        username: 'dfroot',
        password: 'Q0k9Ka1858OW',
        database: 'df_sso_orm',
        host: '10.1.113.4',
        dialect: 'mysql',
    },
};
