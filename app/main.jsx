'use strict'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import store from './store'
import DeckBuilder from './components/DeckBuilderContainer'

render(
    <MuiThemeProvider>
        <Provider store={store}>
            <DeckBuilder />
        </Provider>
    </MuiThemeProvider>
    ,
    document.getElementById('main')
)
