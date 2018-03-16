import React from 'react'
import { connect } from 'react-redux'
import { Component } from 'react'
import { removeCardFromDeck, updateCardInDeck } from '../reducers/deck.js'
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import ContentClear from 'material-ui/svg-icons/content/clear';
import RemoveRedEye from 'material-ui/svg-icons/image/remove-red-eye';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import ProbabilityCell from './ProbabilityCell'
import Drawer from 'material-ui/Drawer';
import { spawn } from 'threads'
import { MediaQuery, Responsive } from 'react-responsive'

const tableStyles = {
    smallButton: {
        height: 20,
        lineHeight: '16px',
        verticalAlign: 'middle',
        width: 20
    },
    smallTableColumn: {
        width: '40px',
        paddingLeft: '0',
        paddingRight: '0',
        textAlign: 'center'
    },
    doubleButtonContainer: {
        padding:'1px',
        display: 'flex',
        flexDirection: 'column',
        width: '20px',
        transform: 'translate(8px, 0px)'
    }
}


class DeckList extends Component {
    constructor(props){
        super(props)
        this.state = {
            drawer: false,
            selectedCard: {}
        }

        this.colors = {
            Blue: '#2693C7',
            Red: '#FC6621',
            Green: '#2BC749',
            White: '#FDEA6D',
            Black: '#A8A39A',
            Grey: '#99968f'
        }
    }

    render() {
        if (this.props){
            return (
                <div className="DeckListContainer">
                    {/* drawer for showing single card previews */}
                    <Drawer
                        containerStyle={{ backgroundColor:'#212121'}}
                        open={this.state.drawer}
                        openSecondary={false}
                        docked={false}
                        width={"47%"}
                    >
                        <div>
                            <div>
                                <img
                                    style={{ transform: 'translate(100px, 10px)', width: 300, height: 'auto'}}
                                    src={`http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=${this.state.selectedCard.multiverseid}&type=card`}
                                />
                            </div>
                            <FloatingActionButton
                                style={{ transform: 'translate(230px, 10px)'}}
                                disabled={!this.state.drawer}
                                label={''}
                                backgroundColor={this.colors.White}
                                mini={true}
                                onClick={(e) => this.setState({calculating:!this.state.calculating ,drawer: !this.state.drawer })}>
                                <RemoveRedEye />
                            </FloatingActionButton>
                        </div>
                    </Drawer>

                    {/* probability table */}
                    <Table>
                        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                            <TableRow>
                                <TableHeaderColumn style={{ width: '20%' }}>Name</TableHeaderColumn>
                                <TableHeaderColumn style={tableStyles.smallTableColumn}>Edit</TableHeaderColumn>
                                <TableHeaderColumn style={tableStyles.smallTableColumn}>Quantity</TableHeaderColumn>
                                {
                                    this.props.turns.map(turn => {
                                        return (
                                            <TableHeaderColumn key={`turn_column_header_${turn}`}style={{ width: '5%', textAlign:'center' }}>{turn}</TableHeaderColumn>
                                        )
                                    })
                                }
                            </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false} showRowHover={true}>
                            {
                                this.props.deckList.map(card=>{
                                    return(
                                        <TableRow key={`${card.uniqueName}_row`}>
                                            <TableRowColumn
                                                style={{ width: '20%'}}
                                                >
                                                {card.name}
                                            </TableRowColumn>
                                            <TableRowColumn style={tableStyles.smallTableColumn}>
                                            <div style={{display:'flex'}}>
                                                <div
                                                    style={tableStyles.doubleButtonContainer}
                                                >
                                                {/* decrement button */}
                                                <FloatingActionButton
                                                    style={{padding:'1px'}}
                                                    iconStyle={tableStyles.smallButton}
                                                    zDepth={0}
                                                    disabled={card.quantity < 1}
                                                    backgroundColor={this.colors.Blue}
                                                    mini={true}
                                                    onClick={() => {
                                                        this.props.updateCardQuant(card.uniqueName, card.quantity - 1)
                                                    }
                                                    }>
                                                    <ContentRemove />
                                                </FloatingActionButton>
                                                {/* remove-from-deck button */}
                                                <FloatingActionButton
                                                    style={{padding:'1px'}}
                                                    iconStyle={tableStyles.smallButton}
                                                    zDepth={0}
                                                    backgroundColor={this.colors.Red}
                                                    mini={true}
                                                    onClick={() => this.props.removeCard(card.uniqueName)}>
                                                    <ContentClear />
                                                </FloatingActionButton>
                                                </div>
                                                <div
                                                    style={tableStyles.doubleButtonContainer}
                                                >
                                                    {/* increment button */}
                                                    <FloatingActionButton
                                                        style={{padding:'1px'}}
                                                        iconStyle={tableStyles.smallButton}
                                                        zDepth={0}
                                                        disabled={card.quantity > 3 && !card.type.includes('Basic Land')}
                                                        backgroundColor={this.colors.Green}
                                                        mini={true}
                                                        onClick={() => this.props.updateCardQuant(card.uniqueName, card.quantity + 1)}>
                                                        <ContentAdd/>
                                                    </FloatingActionButton>
                                                    {/* open preview button */}
                                                    <FloatingActionButton
                                                        style={{padding:'1px'}}
                                                        iconStyle={tableStyles.smallButton}
                                                        zDepth={0}
                                                        disabled={this.state.drawer}
                                                        label={''}
                                                        backgroundColor={this.colors.White}
                                                        onClick={(e) => this.setState({ calculating: !this.state.calculating, drawer: !this.state.drawer, selectedCard: card })}>
                                                        <RemoveRedEye />
                                                    </FloatingActionButton>
                                                </div>
                                            </div>
                                            </TableRowColumn>
                                            <TableRowColumn style={tableStyles.smallTableColumn}>{card.quantity}</TableRowColumn>
                                            {/* probabilitiy cells */}
                                            {
                                                this.props.turns.map(turn=>{
                                                    return (
                                                        <TableRowColumn key={`probability_table_cell_${card.multiverseid}_${turn}`} style={{ width: '5%' }}>
                                                            <ProbabilityCell
                                                                key = { `${card.multiverseid}_${turn}` }
                                                                draws = { 6 + turn }
                                                                card = { card }
                                                                deck = { this.props.deck }
                                                            />
                                                        </TableRowColumn>
                                                    )
                                                })
                                            }
                                        </TableRow>
                                    )
                                })
                            }
                        </TableBody>
                    </Table>
                </div>
            )
        }
    }
}

function mapStateToProps(storeState) {
    return {
        deck: storeState.deckReducer,
        user: storeState.defaultUser
    }
}

function mapDispatchToProps(dispatch) {
    return {
        updateCardQuant: (uniqueName,value) => {
            dispatch(updateCardInDeck(uniqueName,{quantity: value}))
        },
        removeCard: (cardUniqName) => {
            dispatch(removeCardFromDeck(cardUniqName));
        }
    }
}

const DeckListView = connect(mapStateToProps, mapDispatchToProps)(DeckList)

export default DeckListView;
