import React, { Component } from 'react'
import { connect } from 'react-redux'
import { SaveUserDecks, UpdateUserDeck } from '../reducers/userDecks'
import { selectDeck } from '../reducers/selectedDeck'
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import { one } from 'nouns'
import { colors } from '../../public/stylesheets/Colors'

class SaveDeckForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: ''
    }
  }

  componentWillMount(){
    const nounOne = one()
    const nounTwo = one()
    const nounThree = one()
    const nouns = ((nounOne + nounTwo).length > 15) ? nounOne[0].toUpperCase() + nounOne.slice(1) + nounTwo[0].toUpperCase() + nounTwo.slice(1) : nounOne[0].toUpperCase() + nounOne.slice(1) + nounTwo[0].toUpperCase() + nounTwo.slice(1) + nounThree[0].toUpperCase() + nounThree.slice(1)
    this.setState({ name: nouns })
  }

  componentDidMount(){
    if (this.props.selectedDeck.length) {
      this.setState({ name: this.props.selectedDeck })
    }
  }

  render() {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignContent: 'center' }}>
        <TextField
          style={{ width: '300px' }}
          hintText="Give your deck a title"
          value={this.state.name}
          onChange={(event) => this.setState({ name: event.target.value })}
        />
        <div style={{ display: 'flex' }}>
          <FlatButton
            label="Submit"
            disabled={!this.state.name.length}
            primary={true}
            onClick={() => {
              this.props.handleSaveDeck(this.state.name, this.props.user, this.props.deck)
              this.props.callSnackbar(`Saved as ${this.state.name}`)
              this.props.closeDialog()
              }}
          />
          <FlatButton
            label="Cancel"
            primary={true}
            onClick={() => {
              this.props.callSnackbar('Not Saved')
              this.props.closeDialog()
            }}
          />
        </div>
      </div>
    )
  }
}

const mapState = (storeState) => {
  return {
    user: storeState.defaultUser,
    deck: storeState.deckReducer,
    selectedDeck: storeState.selectedDeckReducer
  }
}

const mapDispatch = (dispatch) => {
  return {
    handleSaveDeck: (name, user, deck) => {
      dispatch(SaveUserDecks(name, user, deck))
      dispatch(selectDeck(name))
    },
  }
}

const SaveDeck = connect(mapState, mapDispatch)(SaveDeckForm)

export default SaveDeck
