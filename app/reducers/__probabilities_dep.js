import axios from 'axios'

// action types
const SET_PROBABILITY = 'SET_PROBABILITY'
const SET_LOADING = 'SET_LOADING'

// helper
function cardCost(card) {
  return card.manaCost
    .split('{')
    .slice(1)
    .map(v => v.slice(0, -1))
    .reduce((a, b) => {
      if (Object.keys(a).includes(b)) {
        a[b]++;
      } else {
        if (!['B', 'G', 'W', 'R', 'U'].includes(b[0]))
          a.C = !isNaN(parseInt(b)) ? parseInt(b) : 0;
        else a[b] = 1;
      }
      return a;
    }, { C: 0 });
}

function convertedManaCost(cost) {
  return Object.keys(cost).reduce((a, b) => a + cost[b], 0)
}

export const setProbability = (cardId, turn, p, deck) => {
  return {
    type: SET_PROBABILITY,
    cardId,
    turn,
    p,
    deck
  }
}

export const setCurveToLoading = () => {
  return { type: SET_LOADING }
}

export const computeCurve = (draws, card, deck) => {
  const deckNamesAndQuants = JSON.stringify(deck.map(card => ({ name: card.uniqueName, quantity: card.quantity })))

  return dispatch => {
    dispatch(setProbability(card.uniqueName, draws - 6, 'loading', deck))
    // handles 0 probabilities. idk why they were an issue still
    if (draws - 6 < convertedManaCost(cardCost(card))){
      dispatch(setProbability(card.uniqueName, draws - 6, 0, deck))
    }
    // handles calculating new probabilities
    else {
      axios.post('api/alg', ({ draws, card, deck }))
        .then(res => {
          dispatch(setProbability(card.uniqueName, draws - 6, res.data, deck))
        });
    }
  }
}

const deckSizeCounter = (deck) => deck.reduce((count, card) =>{
  return count + card.quantity
}, 0)

// sub reducer
const probabilityReducer = (probabilities = {}, action) => {
  switch (action.type) {
    case SET_LOADING:
      return Object.keys(probabilities).reduce((newProbs, card) => {
        newProbs[card] = new Array(9).fill('loading')
        return newProbs
      }, {})
    case SET_PROBABILITY:
      let newProbs = Object.assign({}, probabilities)
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
