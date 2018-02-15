import { expect } from 'chai';
import Node from '../lib/Node'

describe('NODE', () => {
  let node;

  beforeEach(() => {
    node = new Node()
  })

  it('should exist', () => {
    expect(node).to.exist
  })

  it('should default complete word to false', () => {
    expect(node.completeWord).to.equal(false);
  })

  it('should have a default priority of 0', () => {
    expect(node.priority).to.eq(0)
  })

  it('should be able to keep track of children nodes', () => {
    expect(node.children).to.eql({})
  })

})
  
