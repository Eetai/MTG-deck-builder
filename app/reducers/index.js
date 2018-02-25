import { combineReducers } from 'redux'
import filteredCards from './cards'
import deckReducer from './Deck'
import selectedCardReducer from './selectedCard'
import probabilityReducer from './probabilities'



const rootReducer = combineReducers({
    filteredCards,
    deckReducer,
    selectedCardReducer,
    probabilityReducer
})


export default rootReducer
