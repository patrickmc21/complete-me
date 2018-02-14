import { expect } from 'chai';
import Node from '../lib/Node'

describe('NODE', () => {
  let node;

  beforeEach(() => {
    node = new Node()
  })

  it('should be a thing', () => {
    expect(node).to.exist
  })

  it('should default complete word to false', () => {
    expect(node.completeWord).to.equal(false);
  })

  it('should have a default popularity of 0', () => {
    expect(node.popularity).to.eq(0)
  })

  it('should be able to keep track of children nodes in an object', () => {
    expect(node.children).to.eql({})
  })

})
  
