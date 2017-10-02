const config = {
  development: {
    client: 'pg',
    connection: {
      user: process.env.SQL_USER,
      password: process.env.SQL_PASSWORD,
      database: process.env.SQL_DATABASE
    }
  },
  production: {
    client: 'pg',
    connection: {
      user: process.env.SQL_USER,
      password: process.env.SQL_PASSWORD,
      database: process.env.SQL_DATABASE
    }
  }
}

if (process.env.INSTANCE_CONNECTION_NAME && process.env.NODE_ENV === 'production') {
  config.production.connection.host = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`
}

module.exports = config
