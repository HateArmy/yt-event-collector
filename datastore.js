const { MongoClient } = require('mongodb')
const { DateTime } = require('luxon')

function createEvent (data) {
  const dt = DateTime.now().setZone('America/Los_Angeles')
  const { month, year, day } = dt
  return {
    timestamp: dt.toISO(),
    year,
    month,
    day,
    ...data,
  }
}

async function createDatastore (
  url,
) {
  // create connection
  const options = {
    keepAlive: true,
    useUnifiedTopology: true,
  }
  const client = await MongoClient.connect(url, options)
  const db = client.db('hatearmy')
  const superchatsCollection = db.collection('superchats')
  const superStickersCollection = db.collection('superstickers')
  const responsesCollection = db.collection('response')
  return {
    async insertSuperchat (message) {
      const event = createEvent(message)
      console.log('event', event)
      return superchatsCollection.insertOne(event)
    },

    async insertSuperSticker (message) {
      const event = createEvent(message)
      console.log('event', event)
      return superStickersCollection.insertOne(event)
    },

    async insertResponse (json) {
      const event = createEvent(json)
      console.log('event', event)
      return responsesCollection.insertOne(event)
    },
  }
}

module.exports = {
  createDatastore,
}
