import React, { Component } from 'react';
import { connect } from 'react-redux'
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import { fetchCards, fetchFilteredCards } from '../reducers/cards'
import { addCardToDeck } from '../reducers/Deck'
import { logout } from '../reducers/user'
import { fetchUserDecks, clearUserDecks } from '../reducers/userDecks'
import { setNumberCalculated } from '../reducers/numberCalculating'
import AutoComplete from 'material-ui/AutoComplete';
import DeckListView from './DeckList';
import Title from './Title';
import Login from './Login'
import SaveDeck from './SaveDeck'
import LoadDeck from './LoadDeck'
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import MediaQuery from 'react-responsive'
import Dialog from 'material-ui/Dialog';
import LinearProgress from 'material-ui/LinearProgress';
import Snackbar from 'material-ui/Snackbar';

class DeckBuilderContainer extends Component {
    constructor(props) {
        super(props)
        this.state={
            turns:[1,2,3,4,5,6,7,8],
            searchBarId: '',
            searchText: '',
            savedSearch: '',
            snackBarMessage: '',
            displayProgress: 'none',
            snackBarOpen: false,
            openLoginDialog: false,
            openSaveDeckDialog: false,
            openDeckSelectionDialog: false
        }
        this.handleUpdateInput = this.handleUpdateInput.bind(this);
        this.handleReq = this.handleReq.bind(this);
    }

    getNonLandDeckSize(deck){
        return deck.reduce((a, b) => (b.types.includes('Land')) ? a : a + b.quantity, 0)
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
                document.getElementById(this.state.searchBarId).focus()
            }, 100);
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ openDeckSelectionDialog: false, openLoginDialog: false })
        if (nextProps.user.id) {
            if(nextProps.user.id !== this.props.user.id) {
                this.props.getDecks(nextProps.user.id)
            }
        }
        else {
            this.props.clearDecks()
        }

        if (this.getNonLandDeckSize(this.props.deckList) !== this.getNonLandDeckSize(nextProps.deckList)) {
            this.props.setCalculatedNumber(0)
        }

        if (nextProps.loginError) {
            this.setState({ snackBarOpen: true, snackBarMessage: `Error: ${nextProps.loginError.response.data}` })
        }
        else if (nextProps.user.id !== this.props.user.id) {
            if(!nextProps.user.id) {
                this.setState({ snackBarOpen: true, snackBarMessage: "You'll be back" })
            }
            else if (!this.props.user.id) {
                this.setState({ snackBarOpen: true, snackBarMessage: "Welcome!" })
            }
        }

        if (nextProps.calculated === this.getNonLandDeckSize(nextProps.deckList) * 8) {
            setTimeout(() => {
                this.setState({ displayProgress: 'none' })
                this.props.setCalculatedNumber(0)
            }, 350);
        }
        else {
            this.setState({ displayProgress: 'flex' })
        }
    }

    render() {
        return (
            <div>
                <div style={{display: 'flex'}}>

                    {/* searchbar and submit button */}
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

                    {/* deck name banner */}
                    <Title title={this.props.selectedDeck}/>

                    {/* drop down menu or login button */}
                    {
                        (this.props.user.id) ?
                            <IconMenu
                                iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                                anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                                targetOrigin={{ horizontal: 'left', vertical: 'top' }}
                                style={{flex: 1}}
                                onItemClick={(event, child) => {
                                    const value = child.props.primaryText
                                    if (value === 'Logout') this.props.handleLogout()
                                    if (value === 'Save Deck') this.setState({ openSaveDeckDialog: true })
                                    if (value === 'Load Deck') this.setState({ openDeckSelectionDialog: true })
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
                    {/* progress bar */}
                    <LinearProgress
                        mode="determinate"
                        min={0}
                        max={this.props.deckList.filter(card => !card.types.includes('Land')).length * 8}
                        value={this.props.calculated}
                        style={{ display: this.state.displayProgress }}
                    />
                    {/* the table of probabilities */}
                    <DeckListView deckList={this.props.deckList} turns={this.state.turns}/>
                </div>

                {/* various dialog boxes */}
                <Dialog
                    open = {this.state.openLoginDialog}
                    onRequestClose = {() => this.setState({ openLoginDialog: false })}
                    >
                    <Login/>
                </Dialog>
                <Dialog
                    open = {this.state.openSaveDeckDialog}
                    onRequestClose = {() => this.setState({ openSaveDeckDialog: false })}
                    >
                    <SaveDeck/>
                </Dialog>
                <Dialog
                    open={this.state.openDeckSelectionDialog}
                    onRequestClose={() => this.setState({ openDeckSelectionDialog: false })}
                    autoScrollBodyContent={true}
                >
                    <LoadDeck />
                </Dialog>

                {/* snackbar for show errors and greetings */}
                <Snackbar
                    open={this.state.snackBarOpen}
                    message={this.state.snackBarMessage}
                    action={(this.state.snackBarMessage.indexOf("Error")) ? "" : "Try Again"}
                    autoHideDuration={3000}
                    onRequestClose={() => this.setState({ snackBarOpen: false })}
                    onActionClick={() => this.setState({ snackBarOpen: false, openLoginDialog: !this.state.snackBarMessage.indexOf("Error") })}
                />
            </div>
        )
    }
}

function mapStateToProps(storeState) {
    return {
        filteredCards: storeState.filteredCards,
        deckList: storeState.deckReducer,
        selectedCard: storeState.selectedCardReducer,
        selectedDeck: storeState.selectedDeckReducer,
        user: storeState.defaultUser,
        calculated: storeState.numberCalculatingReducer,
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
        getDecks: (userId) => {
            dispatch(fetchUserDecks(userId))
        },
        clearDecks: () => {
            dispatch(clearUserDecks())
        },
        setCalculatedNumber: (num) => {
            dispatch(setNumberCalculated(num))
        }
    }
}

const DeckBuilder = connect(mapStateToProps, mapDispatchToProps)(DeckBuilderContainer)


export default DeckBuilder
