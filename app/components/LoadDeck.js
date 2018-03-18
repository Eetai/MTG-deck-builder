import React, { Component } from 'react'
import { connect } from 'react-redux'
import { loadDeck } from '../reducers/Deck'
import { selectDeck } from '../reducers/selectedDeck'
import { renameDeck } from '../reducers/userDecks'
import FlatButton from 'material-ui/FlatButton';
import { List, ListItem } from 'material-ui/List';
import TextField from 'material-ui/TextField';
import ContentCreate from 'material-ui/svg-icons/content/create';
import { colors } from '../../public/stylesheets/Colors'

class LoadDeckForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      editingName: false,
      newName: '',
      editingDeckId: ''
    }
  }

  render() {
    return (this.state.editingName) ? (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignContent: 'center' }}>
        <TextField
          id="namechangeinput"
          defaultValue={this.state.newName}
          hintText="give your deck a name"
          onChange={(event) => this.setState({ newName: event.target.value })}
        />
        <div style={{ display: 'flex' }}>
          <FlatButton
            label="Set New Name"
            primary={true}
            disabled={!this.state.newName.length}
            onClick={(event) => {
              event.preventDefault()
              this.props.changeName(this.props.user.id, this.state.editingDeckId, this.state.newName)
              this.setState({ editingName: false, editingDeckId: '', newName: '' })
            }}
          />
          <FlatButton
            label="Cancel"
            primary={true}
            onClick={(event) => {
              event.preventDefault()
              this.setState({ editingName: false })
            }}
          />
        </div>
      </div>
    ) : (
      <div>
        <List>
          {
            this.props.decks.map((deck, index) => {
              return (
                <ListItem
                  key = {index}
                  primaryText = {deck.name}
                  onClick = {() => this.props.chooseDeck(this.props.user.id, deck.id, deck.name)}
                  rightIconButton={
                    <ContentCreate
                      hoverColor={'red'}
                      style={{ height: '48px', justifyContent: 'center', alignContent: 'center', paddingRight: '12px' }}
                      onClick={() => this.setState({ editingName: true, editingDeckId: deck.id, newName: deck.name })}
                      />
                  }
                />
              )
            })
          }
        </List>
      </div>
    )
  }
}

const mapState = (storeState) => {
  return {
    decks: storeState.userDeckReducer,
    user: storeState.defaultUser
  }
}

const mapDispatch = (dispatch) => {
  return {
    chooseDeck: (userId, deckId, name) => {
      dispatch(loadDeck(userId, deckId))
      dispatch(selectDeck(name))
    },
    changeName: (userId, deckId, newName) => {
      dispatch(renameDeck(userId, deckId, newName))
    }
  }
}

const LoadDeck = connect(mapState, mapDispatch)(LoadDeckForm)

export default LoadDeck
