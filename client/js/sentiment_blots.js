import Quill from 'quill'

let Inline = Quill.import('blots/inline');

class PosBlot1 extends Inline { }
PosBlot1.blotName = 'pos1'
PosBlot1.tagName = 'pos1'

Quill.register(PosBlot1)

class PosBlot2 extends Inline { }
PosBlot2.blotName = 'pos2'
PosBlot2.tagName = 'pos2'

Quill.register(PosBlot2)

class PosBlot3 extends Inline { }
PosBlot3.blotName = 'pos3'
PosBlot3.tagName = 'pos3'

Quill.register(PosBlot3)

class PosBlot4 extends Inline { }
PosBlot4.blotName = 'pos4'
PosBlot4.tagName = 'pos4'

Quill.register(PosBlot4)

class PosBlot5 extends Inline { }
PosBlot5.blotName = 'pos5'
PosBlot5.tagName = 'pos5'

Quill.register(PosBlot5)

class NegBlot1 extends Inline { }
NegBlot1.blotName = 'neg1'
NegBlot1.tagName = 'neg1'

Quill.register(NegBlot1)

class NegBlot2 extends Inline { }
NegBlot2.blotName = 'neg2'
NegBlot2.tagName = 'neg2'

Quill.register(NegBlot2)

class NegBlot3 extends Inline { }
NegBlot3.blotName = 'neg3'
NegBlot3.tagName = 'neg3'

Quill.register(NegBlot3)

class NegBlot4 extends Inline { }
NegBlot4.blotName = 'neg4'
NegBlot4.tagName = 'neg4'

Quill.register(NegBlot4)

class NegBlot5 extends Inline { }
NegBlot5.blotName = 'neg5'
NegBlot5.tagName = 'neg5'

Quill.register(NegBlot5)

// Export Quill with new blots.
module.exports.Quill = Quill
