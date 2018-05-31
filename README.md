# complete-me

An auto-complete plugin using a prefix-trie. 

### Methods

##### Insert

Insert new word into trie

##### Populate

Takes array of words as argument, runs `insert` method on each word

##### Suggest

Returns array of words matching supplied prefix argument based on trie's inserted words

##### Select

Adds priority to word so that it appears first in `suggest` return

##### Delete

Removes word from Trie
