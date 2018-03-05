import { combineReducers } from 'redux'
import filteredCards from './cards'
import deckReducer from './deck'
import selectedCardReducer from './selectedCard'

const rootReducer = combineReducers({
    filteredCards,
    deckReducer,
    selectedCardReducer
})


export default rootReducer
