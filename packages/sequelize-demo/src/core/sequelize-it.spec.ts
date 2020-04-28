// import { Sequelize } from 'sequelize';
import { SequelizeIt } from './sequelize-it';

test('connect to mysql', async () => {
    const sequelize = SequelizeIt(
        {
            dialect: 'mysql',
            host: '10.1.113.4',
            port: 33306,
            username: 'dfroot',
            password: 'Q0k9Ka1858OW',
            database: 'df_sso_orm',
        },
        {}
    );

    const ret = await sequelize
        .authenticate()
        .then(_ => 'connected')
        .catch(_ => 'failed');

    expect(ret).toEqual('connected');
    await sequelize.close();
});
