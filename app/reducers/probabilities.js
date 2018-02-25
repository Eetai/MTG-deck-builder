import axios from 'axios'

// action types
const SET_PROBABILITY = 'SET_PROBABILITY'

export const setProbability = (cardId, turn, p, deck) => {
  return {
    type: SET_PROBABILITY,
    cardId,
    turn,
    p,
    deck
  }
}

export const computeCurve = (draws, card, deck) => {
  return dispatch => {
    dispatch(setProbability(card.uniqueName, draws - 6, 'loading', deck))
    axios.post('api/alg', ({ draws, card, deck }))
      .then(res => {
      dispatch(setProbability(card.uniqueName, draws - 6, res.data, deck))
    });
  }
}

const deckSizeCounter = (deck) => deck.reduce((count, card) =>{
  return count + card.quantity
}, 0)

// sub reducer
const probabilityReducer = (probabilities = {cache: {}}, action) => {
  switch (action.type) {
    case SET_PROBABILITY:
      let newProbs = Object.assign({}, probabilities)
      let oldProbs = Object.assign({}, probabilities)
      delete oldProbs.cache

      // caching
      if (deckSizeCounter(action.deck) >= 60) {
        newProbs.cache[action.deck.toString()] = { history: oldProbs, index: Object.keys(newProbs.cache).length-1}
        if (Object.keys(newProbs.cache).length > 10){
          newProbs.cache = Object.keys(newProbs.cache).reduce((newCache, entry)=>{
            if (entry.index > 0) newCache[entry] = {history: entry.history, index: entry.index-1}
            return newCache
          }, {})
        }
      }

      // updating
      if (newProbs[action.cardId]) newProbs[action.cardId][action.turn] = action.p
      else {
        newProbs[action.cardId] = []
        newProbs[action.cardId][action.turn] = action.p
      }
      return newProbs
    default:
      return probabilities
  }
}

export default probabilityReducer
