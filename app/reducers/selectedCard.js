import axios from 'axios'


//action typec
const GET_SELECTED_CARD = 'GET_SELECTED_CARD'
const UNSELECT_CARD = 'UNSELECT_CARD'


// action creator

export const getSelectedCard = (value, cards) => {
    return {
        type: GET_SELECTED_CARD,
        value,
        cards
    }
}


//sub reducer

const selectedCardReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_SELECTED_CARD:

            // sets selected card to be equal to either a card from the users input if they have selected a card from the list, or the first thing in the list, given their input

            let card = action.cards.filter(v => v.uniqueName === action.value)[0] || false
            card = (!card) ? action.cards.filter(v => v.name.toLowerCase().indexOf(action.value.toLowerCase()) === 0)[0] : card
            return card || state
        default:
            return state
    }
}

export default selectedCardReducer
