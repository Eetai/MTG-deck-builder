// action types
const ADD_TO_CACHE = 'ADD_TO_CACHE'

export const addToCache = (deckString, cardName, turn, probability) => {
  return {
    type: ADD_TO_CACHE,
    deckString,
    probabilities
  }
}

// sub reducer
const cacheReducer = (cache = {}, action) => {
  switch (action.type) {
    case ADD_TO_CACHE:
      const newCache = Object.assign({}, cache)

      const newData = {}
      newData[action.deckString].probs = action.probabilities
      newData.index = Object.keys(cache).length

      if (Object.keys(newCache).length > 30) {
        Object.keys(newCache).forEach(deckString => {
          if (newCache[deckString].index === 1) {
            delete newCache[deckString]
          }
          else {
            newCache[deckString].index --
          }
        })
      }

      return newCache
    default:
      return cache
  }
}

export default cacheReducer
