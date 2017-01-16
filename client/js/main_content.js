// Created by Duncan on 12.29.2016
// Methods for main_content.vu
// HTTP calls ect.
import Utils from '../js/utils.js'
import auth from '../js/auth.js'
import docsave from '../js/docsave.js'

module.exports = {
  // Function adds each charactor to input
  update(e) {
    this.input = e.target.value
  },

  wsSend() {
    this.ws.send(this.input);
  },

  // On each keyup counts amount of words on document
  wordCounter() {
    let splitIt = this.input.split(' ');
    // filters out spaces on each 'delete' or 'spacebar' or 'enter' key up then returns the length.
    this.count = splitIt.filter(val => val !== '').length;
  },

  // Function opens websocket with unique ID
  shareChannel(cb) {
    Utils.fetchChannel((response) => {
      this.ws = new WebSocket('ws://' + window.location.host + '/ws/' + response.body);
      // Whenever we receive a message, update textarea
      this.ws.onmessage = e => {
        // console.log('in this.ws.onmessage',e.data)
        if (e.data !== this.input) {
          this.input = e.data;
          this.wordCounter();
        }
        // Callback changes the url in the browser
        cb(response.body);
      };
    });
  },

  showSignin() {
    this.isSignupShowing = false;
    this.isLoginShowing = !this.isLoginShowing;
  },

  showSignup() {
    this.isLoginShowing = false;
    this.isSignupShowing = !this.isSignupShowing;
  },

  showNone() {
    this.isSignupShowing = false;
    this.isLoginShowing = false;
  },

  saveDoc() {
    let prepDoc = {
      username: this.user.data.username,
      name: 'moby dick',
      doc: auth.encrypt(this.input)
    }
    prepDoc = docsave.fixDups(prepDoc);
    docsave.sendDoc(this, prepDoc);
  },

  mobyDick() {
    return `It was nearly six o'clock, but only grey imperfect misty dawn, when we drew nigh the wharf.

"There are some sailors running ahead there, if I see right," said I to Queequeg, "it can't be shadow; she's off by sunrise, I guess; come on!"

"Avast!" cried a voice, whose owner at the same time coming close behind us, laid a hand upon both our shoulders, and then insinuating himself between us, stood stooping forward a little, in the uncertain twilight, strangely peering from Queequeg to me. It was Elijah.

"Going aboard?"

"Hands off, will you," said I.

"Lookee here," said Queequeg, shaking himself, "go 'way!"

"Aint going aboard, then?"

"Yes, we are," said I, "but what business is that of yours? Do you know, Mr. Elijah, that I consider you a little impertinent?"

"No, no, no; I wasn't aware of that," said Elijah, slowly and wonderingly looking from me to Queequeg, with the most unaccountable glances.

"Elijah," said I, "you will oblige my friend and me by withdrawing. We are going to the Indian and Pacific Oceans, and would prefer not to be detained."

"Ye be, be ye? Coming back afore breakfast?"

"He's cracked, Queequeg," said I, "come on."

"Holloa!" cried stationary Elijah, hailing us when we had removed a few paces.

"Never mind him," said I, "Queequeg, come on."

But he stole up to us again, and suddenly clapping his hand on my shoulder, said- "Did ye see anything looking like men going towards that ship a while ago?"

Struck by this plain matter-of-fact question, I answered, saying, "Yes, I thought I did see four or five men; but it was too dim to be sure."

"Very dim, very dim," said Elijah. "Morning to ye."

Once more we quitted him; but once more he came softly after us; and touching my shoulder again, said, "See if you can find 'em now, will ye?

"Find who?"

"Morning to ye! morning to ye!" he rejoined, again moving off. "Oh! I was going to warn ye against- but never mind, never mind- it's all one, all in the family too;- sharp frost this morning, ain't it? Good-bye to ye. Shan't see ye again very soon, I guess; unless it's before the Grand Jury." And with these cracked words he finally departed, leaving me, for the moment, in no small wonderment at his frantic impudence.

At last, stepping on board the Pequod, we found everything in profound quiet, not a soul moving. The cabin entrance was locked within; the hatches were all on, and lumbered with coils of rigging. Going forward to the forecastle, we found the slide of the scuttle open. Seeing a light, we went down, and found only an old rigger there, wrapped in a tattered pea-jacket. He was thrown at whole length upon two chests, his face downwards and inclosed in his folded arms. The profoundest slumber slept upon him.

"Those sailors we saw, Queequeg, where can they have gone to?" said I, looking dubiously at the sleeper. But it seemed that, when on the wharf, Queequeg had not at all noticed what I now alluded to; hence I would have thought myself to have been optically deceived in that matter, were it not for Elijah's otherwise inexplicable question. But I beat the thing down; and again marking the sleeper, jocularly hinted to Queequeg that perhaps we had best sit up with the body; telling him to establish himself accordingly. He put his hand upon the sleeper's rear, as though feeling if it was soft enough; and then, without more ado, sat quietly down there.

"Gracious! Queequeg, don't sit there," said I.

"Oh; perry dood seat," said Queequeg, "my country way; won't hurt him face."

"Face!" said I, "call that his face? very benevolent countenance then; but how hard he breathes, he's heaving himself; get off, Queequeg, you are heavy, it's grinding the face of the poor. Get off, Queequeg! Look, he'll twitch you off soon. I wonder he don't wake."

Queequeg removed himself to just beyond the head of the sleeper, and lighted his tomahawk pipe. I sat at the feet. We kept the pipe passing over the sleeper, from one to the other. Meanwhile, upon questioning him in his broken fashion, Queequeg gave me to understand that, in his land, owing to the absence of settees and sofas of all sorts, the king, chiefs, and great people generally, were in the custom of fattening some of the lower orders for ottomans; and to furnish a house comfortably in that respect, you had only to buy up eight or ten lazy fellows, and lay them around in the piers and alcoves. Besides, it was very convenient on an excursion; much better than those garden-chairs which are convertible into walking sticks; upon occasion, a chief calling his attendant, and desiring him to make a settee of himself under a spreading tree, perhaps in some damp marshy place.

While narrating these things, every time Queequeg received the tomahawk from me, he flourished the hatchet-side of it over the sleeper's head.

"What's that for, Queequeg?"

"Perry easy, kill-e; oh! perry easy!

He was going on with some wild reminiscences about his tomahawk-pipe which, it seemed, had in its two uses both brained his foes and soothed his soul, when we were directly attracted to the sleeping rigger. The strong vapor now completely filling the contracted hole, it began to tell upon him. He breathed with a sort of muffledness; then seemed troubled in the nose; then revolved over once or twice; then sat up and rubbed his eyes.

"Holloa!" he breathed at last, "who be ye smokers?"

"Shipped men," answered I, "when does she sail?"

"Aye, aye, ye are going in her, be ye? She sails to-day. The Captain came aboard last night."

"What Captain?- Ahab?"

"Who but him indeed?"

I was going to ask him some further questions concerning Ahab, when we heard a noise on deck.

"Holloa! Starbuck's astir," said the rigger. "He's a lively chief mate that; good man, and a pious; but all alive now, I must turn to." And so saying he went on deck, and we followed.

It was now clear sunrise. Soon the crew came on board in twos and threes; the riggers bestirred themselves; the mates were actively engaged; and several of the shore people were busy in bringing various last things on board. Meanwhile Captain Ahab remained invisibly enshrined within his cabin.`
  }
}
