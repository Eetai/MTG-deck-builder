import React, { Component } from 'react';
import { connect } from 'react-redux'
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import { fetchCards, fetchFilteredCards } from '../reducers/cards'
import { addCardToDeck, logout } from '../reducers'
import AutoComplete from 'material-ui/AutoComplete';
import DeckListView from './DeckList';
import Login from './Login'
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import MediaQuery from 'react-responsive'
import Dialog from 'material-ui/Dialog';

class DeckBuilderContainer extends Component {
    constructor(props) {
        super(props)
        this.state={
            searchBarId: '',
            searchText: '',
            savedSearch: '',
            openLoginDialog: false,
            openDeckSelectionDialog: false
        }
        this.handleUpdateInput = this.handleUpdateInput.bind(this);
        this.handleReq = this.handleReq.bind(this);
        // this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleUpdateInput(value){
        this.setState({ searchText: value })
        if (value.length){
            this.props.loadFilteredCards(value)
        }
        if (this.state.searchBarId !== '' && document.activeElement.id !== this.state.searchBarId){
            document.getElementById(this.state.searchBarId).focus()
        }
    };

    handleReq(value) {
        if (Object.keys(this.props.selectedCard).length && this.state.searchText.length) {

            // set timeout is hacky. purpose is to make sure when you hit enter while selecting an element in the drop down that you actually add that card. the timer means the following happens: the selected card is set to the selected card, THEN add the card to the deck, as opposed to trying to add the selected card and update the selected card simaltaneously -> causing race contition -> adding wrong card

            setTimeout(() => {
                this.props.addNewCard(this.props.selectedCard);
                document.getElementById(this.state.searchBarId).value = ''
            }, 100);
        }
    }

    componentWillReceiveProps(nextProps){
        this.setState({ openDeckSelectionDialog: false, openLoginDialog: false })
    }

    render() {
        return (
            <div>
                <div style={{display: 'flex'}}>
                    <form method='POST' style={{flex:19}} onSubmit={(e)=>{
                        e.preventDefault()
                        this.handleReq()
                        }} >
                        <AutoComplete
                            hintText="Seach for any MtG card by name"
                            searchText={this.state.searchText}
                            dataSource={this.props.filteredCards.map(v => v.uniqueName)}
                            onUpdateInput={this.handleUpdateInput}
                            onSelect={()=>{
                                if(!this.state.searchBarId) this.setState({searchBarId: document.activeElement.id})
                            }}
                            onNewRequest={(v)=>{
                                this.handleReq(v)
                                this.setState({searchText: ''})
                            }}
                            style={{maxWidth: 500}}
                            fullWidth={true}
                            filter={AutoComplete.caseInsensitiveFilter}
                        />
                        <MediaQuery minWidth={652}>
                            { (matches) => (matches) ? <FlatButton label="Submit" primary={true} type='submit' /> : null }
                        </MediaQuery>
                    </form>
                    {
                        (this.props.user.id) ?
                            <IconMenu
                                iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                                anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                                targetOrigin={{ horizontal: 'left', vertical: 'top' }}
                                style={{flex: 1}}
                                onItemClick={(event, child) => {
                                    const value = child.props.primaryText
                                    if(value === 'Logout') this.props.handleLogout()
                                    if(value === 'Save Deck') this.props.handleSaveDeck(this.props.deckList, this.props.user)
                                }}>
                                <MenuItem primaryText="Save Deck" />
                                <MenuItem primaryText="Load Deck" />
                                <MenuItem primaryText="Logout" />
                            </IconMenu>
                            :
                            <div style={{height:48, display:'flex', flexDirection:'column'}}>
                                <FlatButton label="Login" primary={true} style={{flex:1}} onClick={() => this.setState({ openLoginDialog: true })}/>
                            </div>
                    }
                </div>
                <div id='cardViewContainer'>
                    <DeckListView deckList={this.props.deckList} />
                </div>
                <Dialog
                    open={this.state.openLoginDialog}
                    onRequestClose={() => this.setState({ openLoginDialog: false })}
                    >
                    <Login/>
                </Dialog>
            </div>
        )
    }
}

function mapStateToProps(storeState) {
    return {
        filteredCards: storeState.filteredCards,
        deckList: storeState.deckReducer,
        selectedCard: storeState.selectedCardReducer,
        user: storeState.defaultUser,
        loginError: storeState.defaultUser.error
    }
}

function mapDispatchToProps(dispatch) {
    return {
        loadFilteredCards: (value) => {
            dispatch(fetchFilteredCards(value))
        },
        addNewCard: (card) => {
            dispatch(addCardToDeck(card));
        },
        UnselectCard: () => {
            dispatch(unselectCard());
        },
        handleLogout: () => {
            dispatch(logout())
        },
        handleSaveDeck: (deck, user) => {
            dispatch(saveDeck(deck, user))
        }
    }
}

const DeckBuilderContainerContainer = connect(mapStateToProps, mapDispatchToProps)(DeckBuilderContainer)


export default DeckBuilderContainerContainer
