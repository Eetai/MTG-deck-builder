import axios from 'axios'

const SET_DECK = "SET_DECK"
const ADD_CARD_TO_DECK = 'ADD_CARD_TO_DECK'
const UPDATE_CARD_IN_DECK = 'UPDATE_CARD_IN_DECK'
const REMOVE_CARD_FROM_DECK = 'REMOVE_CARD_FROM_DECK'

export const addCardToDeck = (newCard) => {
    return {
        type: ADD_CARD_TO_DECK,
        newCard: Object.assign({},newCard,{quantity:1})
    }
}

export const removeCardFromDeck = (uniqueName) => {
    return {
        type: REMOVE_CARD_FROM_DECK,
        uniqueName
    }
}

export const updateCardInDeck = (uniqueName, changes) => {
    return {
        type: UPDATE_CARD_IN_DECK,
        uniqueName,
        changes
    }
}

const setDeck = (cards) => {
    return {
        type: SET_DECK,
        cards
    }
}

export const loadDeck = (userId, deckId) => {
    return function thunk(dispatch) {
        axios.get(`api/user/${userId}/decks/${deckId}`)
            .then(res => {
                let cards = res.data
                dispatch(setDeck(cards))
            })
            .catch(console.error)
    }
}


const deckReducer = (state = [], action) => {
    switch (action.type) {
        case SET_DECK:
            const sorted = action.cards.sort((a,b) => {
                if (a.types.includes('Land') && !b.types.includes('Lands')) return 1
                else if (b.types.includes('Land') && !a.types.includes('Lands')) return -1
                else return (a.name > b.name) ? 1 : -1
            })
            return sorted
        case REMOVE_CARD_FROM_DECK:
            return state.filter(v => action.uniqueName !== v.uniqueName)
        case UPDATE_CARD_IN_DECK:
            return state.map(v => (action.uniqueName === v.uniqueName) ? Object.assign({}, v, action.changes) : v)
        case ADD_CARD_TO_DECK:
            return (state.map(v=>v.uniqueName).includes(action.newCard.uniqueName)) ? state:[...state, action.newCard]
        default:
            return state
    }
}

export default deckReducer;
