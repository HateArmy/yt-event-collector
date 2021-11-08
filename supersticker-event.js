const { removeMessageFromChatFrame } = require('./chatframe')

let stickerInterval

async function captureSuperStickers (page, chatFrame, datastore) {
  stickerInterval = setInterval(async () => {
    const message = await chatFrame.$('yt-live-chat-paid-sticker-renderer')
    if (message) {
      await captureStickerMessage(datastore, message)
      removeMessageFromChatFrame(chatFrame, message)
    }
  }, 150)
  console.log('Capturing superstickers')
}

async function captureStickerMessage (datastore, message) {
  const [name, amount, img] = await Promise.all([
    message.$eval('div#author-name', el => el.innerText),
    message.$eval('#purchase-amount-chip', el => el.innerText),
    message.$eval('img#img', el => ({ src: el.src, alt: el.getAttribute('alt') })),
  ])
  const superchatObj = { name, amount, img }
  console.log('Sticker received: ', JSON.stringify(superchatObj, null, 2))
  return datastore.insertSuperSticker(superchatObj)
}

function stopCapturingSuperStickers () {
  clearInterval(stickerInterval)
}

module.exports = {
  captureSuperStickers,
  stopCapturingSuperStickers,
}
