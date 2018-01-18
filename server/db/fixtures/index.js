const db = require('../models');
const Card = db.Card
const mtgJson = require('./AllSets.json')

//an array of all the keys

//within each set[array] -> get cards array

//optional mana cost reducer, could be useful
//converts manacost to object, e.x.: '{2}{B}{B}{U}' => { colorless: 2, B: 2, U: 1 }
// Card.prototype.cost = function () {
//     return this.manaCost.split('{').slice(1).map(v => v.slice(0, -1)).reduce((a, b) => {
//         if (Object.keys(a).includes(b)) {
//             a[b]++
//         } else {
//             if (!isNaN(parseInt(b))) a.colorless = parseInt(b)
//             else a[b] = 1
//         }
//         return a
//     }, {})
// }

const mtgSets = Object.keys(mtgJson);
let setNames = mtgSets.map((name) => {
    return mtgJson[name].name;
})
//get array of each cards array
const cardSets = mtgSets.map((name) => {
    return mtgJson[name].cards;
})


for (var i = 0; i < setNames.length; i++) {
    for (var j = 0; j < cardSets[i].length; j++) {
        cardSets[i][j].set = setNames[i];
    }
}


//forEach array, push into a cards array
//nested forEach
const allCards = []

cardSets.forEach(function (cardSet) {
    cardSet.forEach(function (card) {
        delete card.id;
        allCards.push(card);
    })
})

const cardsWithMultiverseId = allCards.reduce((cards,card,i) => {
    if (card.multiverseid) {
        function parse(card){
            let P =''
            let F=''
            if(!card.text) card.text = ''
            if(card.type.includes('Land')) {
                P += card.type.split(' ').reduce((a, b) => {
                    if (b === 'Swamp') a += 'B'
                    if (b === 'Forest') a += 'G'
                    if (b === 'Plains') a += 'W'
                    if (b === 'Mountain') a += 'R'
                    if (b === 'Island') a += 'U'
                    return a
                }, '').split('').sort().join(',')
                if (card.text.indexOf('{B}') > 0 && P.indexOf('B') < 0) P += 'B'
                if (card.text.indexOf('{G}') > 0 && P.indexOf('G') < 0) P += 'G'
                if (card.text.indexOf('{W}') > 0 && P.indexOf('W') < 0) P += 'W'
                if (card.text.indexOf('{R}') > 0 && P.indexOf('R') < 0) P += 'R'
                if (card.text.indexOf('{U}') > 0 && P.indexOf('U') < 0) P += 'U'
                if (card.text.indexOf('{C}') > 0 && P.indexOf('C') < 0) P += 'C'
                if (card.text.indexOf('any color') > 0 && P.indexOf('B') < 0) P += 'WRGBU'
                if (card.text.indexOf(`Sacrifice ${card.name}: Search`) > -1) {
                    P += 'F'
                }
            }

            if(P === '') P = false
            else P = P.split('').sort().reduce((a, b) => (a.includes(b) || b=== ' ' || b===',') ? a : a.concat(b),[]).join(',')

            F = (P === 'F') ? card.text.split('\n').reduce((a, b) => {
                if (b.indexOf(`Sacrifice ${card.name}: Search`) > -1) {
                    if (b.indexOf('basic') > 0 && a.indexOf('C') < 0) a += 'Basic,'
                    if (b.indexOf('Mountain') > 0 && a.indexOf('C') < 0) a += 'Mountain,'
                    if (b.indexOf('Forest') > 0 && a.indexOf('C') < 0) a += 'Forest,'
                    if (b.indexOf('Island') > 0 && a.indexOf('C') < 0) a += 'Island,'
                    if (b.indexOf('Swamp') > 0 && a.indexOf('C') < 0) a += 'Swamp,'
                    if (b.indexOf('Plains') > 0 && a.indexOf('C') < 0) a += 'Plains,'
                }
                return a
            }, '').slice(0, -1) : false
            return[P,F]
        }
        let ProducibleManaColors = ''
        let fetchOptions = ''
        ProducibleManaColors = parse(card,ProducibleManaColors,fetchOptions)[0]
        fetchOptions = parse(card, ProducibleManaColors, fetchOptions)[1]

        cards.push(Object.assign({}, card, { fetchOptions , ProducibleManaColors , uniqueName: (card.name + ' (' + card.set + ') #' + card.multiverseid)}))
    };
    return cards
},[])


// seed file for mtg db
Card.sync({
        force: true
    })
    .then(() => {
        Card.bulkCreate(cardsWithMultiverseId);

    })
    .then(() => {
        console.log('success');
    })
    .catch();
