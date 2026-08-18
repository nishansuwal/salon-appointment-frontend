const saveToRedux = (state, payload) => {
  if (state.data === payload?.data) return

  if (payload?.data) {

    state.data = payload.data
    state.total = payload.total
    state.nextPageUrl = payload.next_page_url
    state.prevPageUrl = payload.prev_page_url
  } else {
    state.message = payload
  }
}
export default saveToRedux
