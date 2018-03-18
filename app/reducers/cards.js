import axios from 'axios'
import { getSelectedCard, unselectCard } from './selectedCard'


// action types
const GET_ALL_CARDS = 'GET_ALL_CARDS'
const GET_FILTERED_CARDS = 'GET_FILTERED_CARDS'

export const getFilteredCards = (filteredCards) => {
    return {
        type: GET_FILTERED_CARDS,
        filteredCards
    }
}

export const fetchFilteredCards = (value) => {
    return function thunk(dispatch) {
        axios.get('api/cards/filteredcards/' + value)
            .then(res => {
                let cards = (res.data.includes("<!doctype html>")) ? [] : res.data
                dispatch(getFilteredCards(cards))
                return cards
            })
            .then(cards => {
                return dispatch(getSelectedCard(value,cards))
            })
            .catch(console.error)
    }
}


// sub reducer
const cardReducer = (state = [], action) => {
    switch (action.type) {
        case GET_FILTERED_CARDS:
            return action.filteredCards
        default:
            return state
    }
}

export default cardReducer
