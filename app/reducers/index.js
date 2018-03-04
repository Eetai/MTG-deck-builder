import { combineReducers } from 'redux'
import filteredCards from './cards'
import deckReducer from './Deck'
import selectedCardReducer from './selectedCard'
import probabilityReducer from './probabilities'
import cacheReducer from './probabilityCache'



const rootReducer = combineReducers({
    filteredCards,
    deckReducer,
    selectedCardReducer,
    probabilityReducer,
    cacheReducer
})


export default rootReducer
