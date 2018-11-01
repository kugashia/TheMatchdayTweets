const keys = require('./keys');

// Map global promises
const MongoClient = require('mongodb').MongoClient

class Connection {
    static connectToDB() {
        if (this.database) return Promise.resolve(this.database)
        return MongoClient.connect(this.url, {useNewUrlParser: true}, this.options)
            .then(client => this.db = client.db('tweets_db'))
            .then(() => console.log('MongoDB is connected'))
            .catch(err => console.log(err));
    }
}

Connection.db = null
Connection.url = keys.mongoURI,
Connection.options = {
    bufferMaxEntries: 0,
    reconnectTries: 5000,
}

module.exports = Connection