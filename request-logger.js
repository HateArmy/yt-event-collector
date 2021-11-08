
function concatChatRuns (runs) {
  let txt = ''
  for (const run of runs) {
    if (run.text) {
      txt += run.text
    }
    if (run.emoji) {
      txt += run.emoji.emojiId
    }
  }
  return txt
}

async function isChatResponse (req) {
  return req.url().includes('get_live_chat')
}

async function captureChatMessages (resp, datastore) {
  try {
    const text = await resp.text()
    const json = JSON.parse(text)
    datastore.insertResponse(json)

    const actions = json.continuationContents?.liveChatContinuation?.actions
    const chatActions = actions
      .filter(a => a.addChatItemAction)
      .map(a => a.addChatItemAction.item.liveChatTextMessageRenderer)

    chatActions.forEach(chat => {
      const name = chat.authorName.simpleText
      const msg = concatChatRuns(chat.message.runs)
      console.log(`${name}: ${msg}`)
    })
  } catch (e) {}
}

async function captureRequests (page, datastore) {
  page.on('response', async (resp) => {
    if (isChatResponse(resp)) {
      captureChatMessages(resp, datastore)
    }
  })
  console.log('Capturing requests')
}

function stopCapturingRequests () {
}

module.exports = {
  captureRequests,
  stopCapturingRequests,
}
