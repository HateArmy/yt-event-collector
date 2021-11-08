const puppeteer = require('puppeteer')
const { createDatastore } = require('./datastore')
const { captureSuperchats } = require('./superchat-event')
const { captureSuperStickers } = require('./supersticker-event')
const { captureRequests } = require('./request-logger')
const { captureStreamEnds } = require('./streamend-event')

async function startServer (streamUrl) {
  const browser = await puppeteer.launch({
    headless: false,
  })
  const url = process.env.MONGO_URL || 'mongodb://localhost:27017'
  const datastore = await createDatastore(url)

  while (true) {
    const page = await browser.newPage()
    await page.setViewport({ width: 1024, height: 768 })
    await page.goto(streamUrl)
    const chatIFrame = await page.$('iframe.ytd-live-chat-frame')

    if (chatIFrame) {
      const chatFrame = await chatIFrame.contentFrame()
      captureSuperchats(page, chatFrame, datastore)
      captureSuperStickers(page, chatFrame, datastore)
      captureRequests(page, datastore)
      await captureStreamEnds(page)
    } else {
      await page.close()
      await new Promise((resolve) => {
        setTimeout(() => resolve(), 1000 * 60)
      })
    }
  }
}

if (require.main === module) {
  startServer('https://www.youtube.com/DSPGaming/live')
}
