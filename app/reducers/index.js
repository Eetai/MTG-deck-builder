import { combineReducers } from 'redux'
import filteredCards from './cards'
import deckReducer from './deck'
import selectedCardReducer from './selectedCard'
import defaultUser from './user'
import userDeckReducer from './userDecks'

const rootReducer = combineReducers({
    filteredCards,
    deckReducer,
    selectedCardReducer,
    defaultUser,
    userDeckReducer
})

export default rootReducer
export * from './user'
