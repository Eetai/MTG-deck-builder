import React from 'react'
import SocialPeople from 'material-ui/svg-icons/social/people';
import SocialPerson from 'material-ui/svg-icons/social/person';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import { Tabs, Tab } from 'material-ui/Tabs';
import { colors } from '../../public/stylesheets/Colors'

const styles = {
  cardText: {
    marginLeft: '15px',
    marginRight: '15px',
    marginTop: '-12px'
  }
}

export default function About(props) {
  return (
    <Tabs
      tabItemContainerStyle={{ backgroundColor: colors.Black }}
      inkBarStyle={{ backgroundColor: colors.White }}
      >
      <Tab label="App">
        <Card style={{ display: 'flex', flexDirection: 'column' }} >
          <CardTitle title="The App" subtitle="General information" />
          <CardHeader
            title="MTG Curve's Motivation"
            subtitle="Something we wanted to use"
            avatar={<img src="./Manapix/Wmana.png" style={{ width: '40px', height: '40px' }} />}
          />
          <CardText style={styles.cardText}>
            All three of members of the team have experience playing MTG. And each of us have always thought it would be great to 'know' how to best balance a deck's landbase. Until now the sorts of decisions that go into sculpting the landbase of have been an esoteric art. Player's like Eetai can be pretty sure they have it right and pretty much everyone else is guessing. We set out to elucidate these decisions for players of all levels. The result of our efforts is this app, which we hope you enjoy.
          </CardText>
          <CardHeader
            title="How to use it"
            subtitle="And what it can do"
            avatar={<img src="./Manapix/Gmana.png" style={{ width: '40px', height: '40px' }} />}
          />
          <CardText style={styles.cardText}>
            Users can create decks by searching for cards in the search bar at the top left of the app. Once cards have been added to a deck, a user can adjust the quantity of any card in the deck, remove a card from the deck, view spoilers of the cards in the deck. Adding cards to a deck populates the app's table which shows relevant (although not necessarily exhaustive) manacolors which a land produces for land cards, and the probabilities of being able to draw, and play, any given non-land card, based on the decks specific composition.
          </CardText>
          <CardText style={styles.cardText}>
            Users can also login, which enables them to save decklists, or load old decklists which they have saved. Usernames, passwords, decks, etc. are not shared among other users or entities.
          </CardText>
        </Card>
      </Tab>
      <Tab label="Algorithm">
        <Card style={{ display: 'flex', flexDirection: 'column' }} >
          <CardTitle title="The Algorithm" subtitle="What it's doing, how, and some assumptions" />
          <CardText style={styles.cardText}>
            The algorithm was entirely designed by Abel. In short its purpose is to parse a deck of cards for all relevant land-mana-sources including, multicolor and fetchlands, and find every hand the deck can yield on a given turn that can successfully play a given card. Then it computes each of these hand’s probabilities and combines them. No statistical analysis is done. The numbers you see are probabilities, this means they are not guesses, they are exact, and will always be the same every time you visit the site. The primary concepts that the algorithm uses to do this are the following:
          </CardText>
          <CardHeader
            title="Vandermonde's Convolution"
            subtitle="an identity for binomial coefficients"
            avatar={<img src="./Manapix/Bmana.png" style={{ width: '40px', height: '40px' }} />}
          />
          <CardMedia style={{ maxWidth: '300px' }}>
            <img src="./Morepix/Vandermondes.png" alt="" style={{ paddingLeft: '25px', width: '434px', height: 'auto' }} />
          </CardMedia>
          <CardText style={styles.cardText}>
            This allows the calculator to handle fetchlands. Fetchlands were problematic. They have side effects, like thinning the deck, and injecting player-choice into the otherwise random act of drawing cards. To handle this the algorithm leverages Vandermonde's convolution, by saying that essentially we can compute a series discrete sub-scenarios and add them together rather than trying to hand the entire computation at once.
          </CardText>
          <CardText style={styles.cardText}>
            In more detail let’s examine the way fetch lands are dealt with. All fetchlands that can fetch lands which are relevant to the colored mana cost requirements of the target card are assumed not to be in the deck. Then one by one various lands are assumed to have been chosen by the player. A heuristic determines the highest value land to fetch given a cards manacost and the number of colors of mana the land can produce. Since for each of these scenarios a land is assumed to have been chosen, the manacost of the target card is truncated to adjust for already having a necessary land. If the land is a dual land, and both colors could count towards the cost of the card, the cards cost is augmented to include splitmana. This models the player deferring their choice until more information is revealed. This assumes optimal play.
          </CardText>
          <CardText style={styles.cardText}>
            Each of these disjoint calculations is weighted by the chance of drawing the given number and types of fetchlands. This effectively partitions the computation of playing the card. The summands in the right hand side of Vandermonde's Convolution can be interpreted as the various scenarios in which various numbers of fetch lands were used to play a given card. This was an essential methodology, because could not be treated in such a way that would entangle fetchlands with ordinary multi colored lands.
          </CardText>
          <CardHeader
            title="Multichoose"
            subtitle="augmented permutations"
            avatar={<img src="./Manapix/Rmana.png" style={{ width: '40px', height: '40px' }} />}
          />
          <CardMedia style={{ maxWidth: '300px' }}>
            <img src="./Morepix/Multichoose.png" alt="" style={{ paddingLeft: '25px', width: '434px', height: 'auto' }} />
          </CardMedia>
          <CardText style={styles.cardText}>
            The next major step of the process is figuring out every possible hand that can play the target card. Multichoose techniques are useful for this and fairly straightforward. They allows us to count the number ways to draw multiples of the same card in a hand of a given size, since technically we need to distinguish between the cards in our deck, even if they have the same name, whereas, we do not care what order we drew them in, given that we got them one at a time -this is an important assumption, nothing about the calculator models drawing multiple cards per turn-.
          </CardText>
          <CardText style={styles.cardText}>
            Here is where the problem kicks in. We do not want a count, so the formula above is actually not of that much use to us. What we actually want is to enumerate the various hands we could draw. Those abstracted enumerations are what we use to compute the probabilities. However, there are trillions of possible hands for a 60 card deck. We need a model for drawing cards such that it A.) doesn't take forever, and B.) doesn't break any rules of the game. Fortunately multichoose can be implemented as an algorithm rather than a formula.
          </CardText>
          <CardText style={styles.cardText}>
            It is basically an augmented permutations algorithm which constructs hands recursively. A hand is essentially a set of buckets, each bucket represents a different kind of card ('produces red mana', 'produces red mana and green mana', 'produces no mana', 'is the card we are trying to play', ...). Similar to how we would create permutations, the algorithm one-by-one duplicates the set of buckets, and for each duplicate it places one more thing in a different bucket. This permutation algorithm also makes sure never to place too many things in any one bucket. This makes sure that duplicate cards are being modeled, but also, not exceeding the quantities in the deck itself.
          </CardText>
          <CardText style={styles.cardText}>
            Once all this is done, every viable hand for playing a given card, on a given turn, has been enumerated. These hands are not synonymous with values though, they are merely abstracted selections of cards, and in practical terms they’re just some 2D arrays. They are however sufficient to begin the actual probability calculation.
          </CardText>
          <CardHeader
            title="Hypergeometric Distributions"
            subtitle="how poker probabilities are calculated"
            avatar={<img src="./Manapix/Umana.png" style={{ width: '40px', height: '40px' }} />}
          />
          <CardMedia style={{ maxWidth: '300px' }}>
            <img src="./Morepix/HypergeometricPMF.png" alt="" style={{ paddingLeft: '25px', width: '434px', height: 'auto' }} />
          </CardMedia>
          <CardText style={styles.cardText}>
            Hypergeometric distributions compute probabilities of drawing specific things without replacement. Since the algorithm has already gone through the exhaustive process of enumerating hands. We can use the above formula directly to convert each hand into a probability. Since we know that the multichoose algorithm is not redundant, we know each hand is different, so we needn't worry about implementing inclusion exclusion or anything remotely fancy. We can simply convert each hand into its respective probability and add them together.
          </CardText>
          <CardText style={styles.cardText}>
            Keeping in mind that this entire process is being done many times in parallel because of how we're implementing Vandermonde's Convolution, the resultant sum from any set of hands will be the probability of having drawn some number of fetchlands, a given card -with a modified manacost based on the number of fetchlands which were drawn-, and some combination of other lands which allow the card to be legally played on the given turn. Finally the algorithm outputs the combined sum of terms from Vandermonde’s Convolution, which are the combined sums of hypergeometric probabilities of each hand from our multichoose process. Or, the most accurate probability ever computed that you’ll hit play any given card in your deck on curve.
         </CardText>
        </Card>
      </Tab>
      <Tab label="Team">
        <Card style={{ display: 'flex', flexDirection: 'column' }} >
          <CardTitle title="The Team" subtitle="Roles and contributions" />
          <CardHeader
            title="Abel"
            subtitle="Lead Engineer"
            avatar={<SocialPerson />}
          />
          <CardText style={styles.cardText} >
            Abel joined the team after Bryan and Eetai had already embarked on creating an MTG deck analyzing app. He ended up pushing the app to take a different direction, as a probability calculator rather than a statistical metagame cruncher. Abel's mathematics background enabled him to approach the problem of computing the probability of playing specific cards in a robust way. Abel also architected much of the app and designed the interface of how to interact with his algorithm.
          </CardText>

          <CardHeader
            title="Bryan"
            subtitle="Engineer, Contributor"
            avatar={<SocialPerson />}
          />
          <CardText style={styles.cardText}>
            Bryan was a casual MTG player growing up, a great team player, and a talented programmer that can dive into any project and get results quickly. He is was a natural choice contributor to the project. Bryan built much of the foundation for the app, from the schemas, to security, Bryan contributed at many steps along the way.
          </CardText>

          <CardHeader
            title="Eetai"
            subtitle="Professional MTG player, Contributor"
            avatar={<SocialPerson />}
          />
          <CardText style={styles.cardText}>
            Eetai was the catalyst behind MTG Curve. His experience on the Pro Tour, and as an ongoing contributor to the highest levels of MTG's metagame, Eetai was a key consultant on every facet of this project. His expertise as a MTG player are the reason for many of the design choices, and inclusion of many features of the app.
          </CardText>
        </Card>
      </Tab>
    </Tabs>
  )
}
