
async function removeMessageFromChatFrame (chatFrame, message) {
  chatFrame.evaluate((msg) => {
    msg.parentNode.removeChild(msg)
  }, message)
}

module.exports = {
  removeMessageFromChatFrame,
}
