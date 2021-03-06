import React, { Component } from 'react';
import { connect } from 'react-redux'
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import MoreHoriz from 'material-ui/svg-icons/navigation/more-horiz';
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
import About from './About'
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import MediaQuery from 'react-responsive'
import Dialog from 'material-ui/Dialog';
import LinearProgress from 'material-ui/LinearProgress';
import Snackbar from 'material-ui/Snackbar';
import { colors } from '../../public/stylesheets/Colors'

const styles = {
    top_left_login_and_dropdown:{
        alignItems: 'flex-start'
    },
    menu_container: {
        display: 'flex',
        justifyContent: 'space-between'
    }
}

class DeckBuilderContainer extends Component {
    constructor(props) {
        super(props)
        this.state={
            turns: [1,2,3,4,5,6,7,8],
            searchBarId: '',
            searchText: '',
            savedSearch: '',
            snackBarMessage: '',
            // displayProgress: 'none',
            snackBarOpen: false,
            openAboutDialog: false,
            openLoginDialog: false,
            openSaveDeckDialog: false,
            openDeckSelectionDialog: false
        }

        this.callSnackbar = this.callSnackbar.bind(this)
        this.handleUpdateInput = this.handleUpdateInput.bind(this);
        this.handleReq = this.handleReq.bind(this);
        this.childClosesOwnDialog = this.childClosesOwnDialog.bind(this);
        this.onDropDownMenuItemChosen = this.onDropDownMenuItemChosen.bind(this);
    }

    onDropDownMenuItemChosen(event, child){
        switch (child.props.primaryText) {
            case "+ Turn":
                this.setState({ turns: this.state.turns.concat(this.state.turns.length + 1) })
                break;
            case "- Turn":
                this.setState({ turns: this.state.turns.slice(0, this.state.turns.length - 1) })
                break;
            case "About":
                this.setState({ openAboutDialog: true })
                break;
            case "Login":
                this.setState({ openLoginDialog: true })
                break;
            case "Save Deck":
                this.setState({ openSaveDeckDialog: true })
                break;
            case "Load Deck":
                this.setState({ openDeckSelectionDialog: true })
                break;
            case "Logout":
                this.props.handleLogout()
                break;
            default:
                break;
        }
    }

    childClosesOwnDialog(){
        this.setState({
            openAboutDialog: false,
            openLoginDialog: false,
            openSaveDeckDialog: false,
            openDeckSelectionDialog: false
        })
    }

    callSnackbar(message) {
        this.setState({
            snackBarOpen: true,
            snackBarMessage: message
        })
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

            // set timeout is hacky. purpose is to make sure when you hit enter while selecting an element in the drop down that you actually add that card. the timer means the following happens: the selected card is set to the selected card in local state, THEN add the card to the deck, as opposed to trying to add the selected card and update the selected card in local state simaltaneously -> causing race contition -> adding wrong card

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
            this.callSnackbar(`Error: ${nextProps.loginError.response.data}`)
        }
        else if (nextProps.user.id !== this.props.user.id) {
            if(!nextProps.user.id) {
                this.callSnackbar("You'll be back")
            }
            else if (!this.props.user.id) {
                this.callSnackbar("Welcome!")
            }
        }

        // if (nextProps.calculated === this.getNonLandDeckSize(nextProps.deckList) * 8) {
        //     setTimeout(() => {
        //         this.setState({ displayProgress: 'none' })
        //         this.props.setCalculatedNumber(0)
        //     }, 350);
        // }
        // else {
        //     this.setState({ displayProgress: 'flex' })
        // }
    }

    render() {
        return (
            <div>
                <div style={styles.menu_container}>
                    <div style={{flex: 15, display:'flex'}}>
                        {/* searchbar */}
                        <form method='POST' style={{display: 'flex', flex:10}} onSubmit={(e)=>{
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
                                style={{maxWidth: 400}}
                                fullWidth={true}
                                filter={AutoComplete.caseInsensitiveFilter}
                            />

                            {/* Submit, +turn, -turn, about buttons */}
                            <MediaQuery minWidth={(this.props.user.id) ? 1085 : 856}>
                                { (matches) => (matches) ?
                                <div>
                                <FlatButton
                                    label="Submit"
                                    primary={true}
                                    type='submit'/>
                                <FlatButton
                                    label="+ Turn"
                                    disabled={this.state.turns.length > 24}
                                    primary={true}
                                    onClick={() => this.setState({ turns: this.state.turns.concat(this.state.turns.length + 1) })}/>
                                <FlatButton
                                    label="- Turn"
                                    disabled={this.state.turns.length < 1}
                                    primary={true}
                                    onClick={() => this.setState({ turns: this.state.turns.slice(0, this.state.turns.length - 1) })}/>
                                <FlatButton
                                    label="About"
                                    primary={true}
                                    onClick={() => this.setState({ openAboutDialog: true })}/>
                                </div>
                                : null }
                            </MediaQuery>

                            {/* ellipses for reactive menu */}
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'row-reverse' }}>
                                { (this.props.user.id) ?
                                <div>
                                    <MediaQuery minWidth={625} maxWidth={1084}>
                                        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                                            <IconMenu
                                                iconButtonElement={<IconButton style={{ bottom: 4 }}><MoreHoriz /></IconButton>}
                                                anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                                                targetOrigin={{ horizontal: 'right', vertical: 'top' }}
                                                onItemClick={(event, child) => this.onDropDownMenuItemChosen(event, child)}
                                            >
                                                <MenuItem primaryText="+ Turn" />
                                                <MenuItem primaryText="- Turn" />
                                                <MenuItem primaryText="About" />
                                            </IconMenu>
                                        </div>
                                    </MediaQuery>
                                    <MediaQuery maxWidth={624}>
                                        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                                            <IconMenu
                                                iconButtonElement={<IconButton style={{ bottom: 4 }}><MoreHoriz /></IconButton>}
                                                anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                                                targetOrigin={{ horizontal: 'right', vertical: 'top' }}
                                                onItemClick={(event, child) => this.onDropDownMenuItemChosen(event, child)}
                                            >
                                                <MenuItem primaryText="+ Turn" />
                                                <MenuItem primaryText="- Turn" />
                                                <MenuItem primaryText="About" />
                                                <MenuItem primaryText="Save Deck" />
                                                <MenuItem primaryText="Load Deck" />
                                                <MenuItem primaryText="Logout" />
                                            </IconMenu>
                                        </div>
                                    </MediaQuery>
                                </div>
                                :
                                <div>
                                    <MediaQuery maxWidth={855} minWidth={500}>
                                        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                                            <IconMenu
                                                iconButtonElement={<IconButton style={{ bottom: 4 }}><MoreHoriz /></IconButton>}
                                                anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                                                targetOrigin={{ horizontal: 'right', vertical: 'top' }}
                                                onItemClick={(event, child) => this.onDropDownMenuItemChosen(event, child)}>
                                                <MenuItem primaryText="+ Turn" />
                                                <MenuItem primaryText="- Turn" />
                                                <MenuItem primaryText="About" />
                                            </IconMenu>
                                        </div>
                                    </MediaQuery>
                                    <MediaQuery maxWidth={499}>
                                        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                                            <IconMenu
                                                iconButtonElement={<IconButton style={{ bottom: 4 }}><MoreHoriz /></IconButton>}
                                                anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                                                targetOrigin={{ horizontal: 'right', vertical: 'top' }}
                                                onItemClick={(event, child) => this.onDropDownMenuItemChosen(event, child)}>
                                                <MenuItem primaryText="+ Turn" />
                                                <MenuItem primaryText="- Turn" />
                                                <MenuItem primaryText="About" />
                                                <MenuItem primaryText="Login" />
                                            </IconMenu>
                                        </div>
                                    </MediaQuery>
                                </div>
                                }
                            </div>
                        </form>

                        {/* deck name banner TRASH */}
                        {/* <Title title={this.props.selectedDeck} /> */}
                    </div>

                    {/* additional menu buttons */}
                    <MediaQuery minWidth={(this.props.user.id) ? 625 : 500} style={styles.top_left_login_and_dropdown}>
                        <div >
                            {(this.props.user.id) ?
                                <div style={{ height: '48px', width: '264'}}>
                                    <FlatButton
                                        label="Save Deck"
                                        primary={true}
                                        onClick={() => this.setState({ openSaveDeckDialog: true })}/>
                                    <FlatButton
                                        label="Load Deck"
                                        primary={true}
                                        onClick={() => this.setState({ openDeckSelectionDialog: true })}/>
                                    <FlatButton
                                        label="Logout"
                                        primary={true}
                                        onClick={() => this.props.handleLogout()}/>
                                </div>
                                :
                                <div style={{ height:48, display:'flex' }}>
                                    <FlatButton
                                        label="Login"
                                        primary={true}
                                        style={{flex:1}}
                                        onClick={() => this.setState({ openLoginDialog: true })}/>
                                </div>
                            }
                        </div>
                    </MediaQuery>
                </div>
                <Divider style={{ marginTop: '-9px'}} />

                <div id='cardViewContainer'>

                    {/* progress bar CURRENTLY BROKEN*/}
                    {/* <LinearProgress
                        mode="determinate"
                        min={0}
                        max={this.props.deckList.filter(card => !card.types.includes('Land')).length * 8}
                        value={this.props.calculated}
                        style={{ display: this.state.displayProgress, position: 'absolute', top: '0px', right: '1px', width: '101%' }}
                    /> */}

                    {/* the table of probabilities */}
                    <DeckListView deckList={this.props.deckList} turns={this.state.turns}/>
                </div>

                {/* various dialog boxes */}
                <Dialog
                    contentStyle={{ maxWidth: '600px' }}
                    open = {this.state.openLoginDialog}
                    onRequestClose = {() => this.setState({ openLoginDialog: false })}
                    >
                    <Login closeDialog={this.childClosesOwnDialog}/>
                </Dialog>
                <Dialog
                    contentStyle={{ maxWidth: '600px' }}
                    open = {this.state.openSaveDeckDialog}
                    onRequestClose = {() => this.setState({ openSaveDeckDialog: false })}
                    >
                    <SaveDeck closeDialog={this.childClosesOwnDialog} callSnackbar={this.callSnackbar}/>
                </Dialog>
                <Dialog
                    contentStyle={{ maxWidth: '600px' }}
                    open={this.state.openDeckSelectionDialog}
                    onRequestClose={() => this.setState({ openDeckSelectionDialog: false })}
                    autoScrollBodyContent={true}
                    >
                    <LoadDeck closeDialog={this.childClosesOwnDialog} callSnackbar={this.callSnackbar}/>
                </Dialog>
                <Dialog
                    contentStyle={{ minWidth: '400px' }}
                    open={this.state.openAboutDialog}
                    onRequestClose={() => this.setState({ openAboutDialog: false })}
                    autoScrollBodyContent={true}
                    >
                    <About />
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
