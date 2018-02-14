import { expect } from 'chai';
import Node from '../lib/Node'

describe.skip('NODE', () => {
  let node;

  beforeEach(() => {
    node = new Node('pizza')
  })

  it('should be a thing', () => {
    expect(node).to.exist
  })

  it('should default next to null', () => {
    expect(node.next).to.equal(null);
  })

  it('should take data and assign it to data prop', () => {
    expect(node.data).to.equal('pizza')
  })

})
  

   // it('should keep track of the words that have been inserted', () => {
   //    expect(trie.wordArray).to.deep.eq([]);

   //    trie.insert('dog');
   //    trie.insert('cat');
   //    trie.insert('bird');

   //    expect(trie.wordArray).to.deep.eq(['dog', 'cat', 'bird '])
   //  })