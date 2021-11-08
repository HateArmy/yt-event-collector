const { removeMessageFromChatFrame } = require('./chatframe')

let superchatInterval

// every 1 second, grab all the superchats in the chat window
// diff with the previous list to get the new ones since last check
// log them to the console
async function captureSuperchats (page, chatFrame, datastore) {
  superchatInterval = setInterval(async () => {
    const message = await chatFrame.$('yt-live-chat-paid-message-renderer')
    if (message) {
      await captureSuperchatMessage(datastore, message)
      removeMessageFromChatFrame(chatFrame, message)
    }
  }, 150)
  console.log('Capturing superchats')
}

async function captureSuperchatMessage (datastore, message) {
  const [name, amount, msg] = await Promise.all([
    message.$eval('div#author-name', el => el.innerText),
    message.$eval('div#purchase-amount', el => el.innerText),
    message.$eval('div#content > div#message', el => el.innerText),
  ])
  const superchatObj = { name, msg, amount }
  console.log('Superchat received: ', JSON.stringify(superchatObj, null, 2))
  return datastore.insertSuperchat(superchatObj)
}

function stopCapturingSuperchats () {
  clearInterval(superchatInterval)
}

module.exports = {
  captureSuperchats,
  stopCapturingSuperchats,
}
