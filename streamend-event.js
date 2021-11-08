/**
 * Look for an element that matches the following
 * div class= html5-endscreen ytp-player-content videowall-endscreen
 *   div class= ytp-endscreen-content
 */
async function captureStreamEnds (page, chatFrame, datastore) {
  return new Promise((resolve) => {
    setInterval(async () => {
      const streamEnded = false
      if (streamEnded) {
        resolve()
      }
    }, 150)
  })
}

module.exports = {
  captureStreamEnds,
}
