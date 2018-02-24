import { expect } from 'chai';
import Node from '../lib/Node'
import Trie from '../lib/Trie'
import fs from 'fs';

const text = "/usr/share/dict/words"
const dictionary = fs.readFileSync(text).toString().trim().split('\n')


describe('Trie', () => {
  let trie;

  beforeEach(() => {
    trie = new Trie();
  });

  it('should instantiate our good friend, Trie', () => {
    expect(trie).to.exist
  })

  it('should start with zero elements', () => {
    expect(trie.count).to.eq(0);
  });

  it('should store child nodes', () => {
    expect(trie.children).to.deep.eq({})
  })

  describe('Insert', () => {

    it('should increment the number of words', () => {
      trie.insert('tacocat');
      expect(trie.count).to.eq(1);
    })

    it('should not increment the number of words if inserting a duplicate word', () => {
      expect(trie.count).to.eq(0);
      trie.insert('ball')
      expect(trie.count).to.eq(1);
      trie.insert('ball')
      expect(trie.count).to.eq(1);
    })

    it('should create keys in children object of first letter', () => {
      trie.insert('tacocat')
      trie.insert('pizza')
      trie.insert('cat')
      expect(Object.keys(trie.children)).to.deep.eq(['t','p','c'])
    })

    it('it should not have duplicate child nodes', () => {
      trie.insert('tacocat')
      trie.insert('pizza')
      trie.insert('cat')
      trie.insert('piano');
      trie.insert('dog');
      trie.insert('catalog')
      expect(Object.keys(trie.children)).to.deep.eq(['t','p','c','d']);
      expect(trie.count).to.eq(6);
    })

    it('should change the complete word property of the last node', () => {
      trie.insert('one');
      expect(trie.children['o'].children['n'].children['e'].completeWord).to.eq('one')
    })

    it('should not alter the complete property of any node but the last node', () => {
      trie.insert('one');
      expect(trie.children['o'].completeWord).to.eq(false)
      expect(trie.children['o'].children['n'].completeWord).to.eq(false)
    })

  })

  describe('Suggest', () => {

    it('should suggest a word based on a prefix', () => {
      trie.insert('doggo');
      let suggestions = trie.suggest('do');
      expect(suggestions).to.eql(['doggo'])
    })

    it('should suggest a word if the user input matches the word', () => {
      trie.insert('apple');
      let suggestions = trie.suggest('apple')
      expect(suggestions.some(current => current === 'apple')).to.be.true;
    })

    it('should suggest multiple words', () => {
      trie.insert('doggo');
      trie.insert('dog');
      trie.insert('doggy');
      trie.insert('piano');
      trie.insert('pizza');
      trie.insert('doggoneprefixtries');
      trie.insert('piazza');
      trie.insert('tomato');

      let suggestions = trie.suggest('do');
      expect(suggestions.some(current => current === 'doggo')).to.be.true
      expect(suggestions.some(current => current === 'dog')).to.be.true
      expect(suggestions.some(current => current === 'doggy')).to.be.true
      expect(suggestions.some(current => current === 'doggoneprefixtries')).to.be.true 

      let options = trie.suggest('pi');
      expect(options.some(current => current === 'pizza')).to.be.true
      expect(options.some(current => current === 'piazza')).to.be.true
      expect(options.some(current => current === 'piano')).to.be.true

      let tWord = trie.suggest('to');
      expect(tWord.some(current => current === 'tomato')).to.be.true

    })

    it('should not suggest any word if their is no word present matching the prefix', () => {
      trie.insert('doggo');
      trie.insert('dog');
      trie.insert('doggy');
      trie.insert('piano');
      trie.insert('pizza');
      trie.insert('doggoneprefixtries');
      trie.insert('piazza');
      trie.insert('tomato');
      let suggestions = trie.suggest('ze');
      expect(suggestions.length).to.eq(0);
    })

    it('should not suggest duplicate words', () => {
      trie.insert('bell');
      trie.insert('bell');
      let suggestions = trie.suggest('be');
      expect(suggestions).to.eql(['bell'])
      expect(trie.count).to.eq(1);
    })

  })

  describe('populate', () => {
    it('should take in an array of words', () => {
      let wordArray = ['aloha', 'burrito', 'chupacabra'];
      expect(trie.count).to.eq(0);
      trie.populate(wordArray);
      expect(trie.count).to.eq(3)
    })

    it('it should be able to take in an array of lots of words', () => {
      expect(trie.count).to.eq(0);
      trie.populate(dictionary);
      expect(trie.count).to.eq(235886);
    })

     it('should recommend many words', () => {
      trie.populate(dictionary);
      let suggestions = trie.suggest('piz');
      expect(suggestions.some(current => current === 'pize')).to.be.true
      expect(suggestions.some(current => current === 'pizza')).to.be.true
      expect(suggestions.some(current => current === 'pizzeria')).to.be.true
      expect(suggestions.some(current => current === 'pizzicato')).to.be.true
      expect(suggestions.some(current => current === 'pizzle')).to.be.true
     })
  })

  describe('select', () => {
    it('should increment the priority of a word', () => {
      trie.insert('one');
      expect(trie.children['o'].children['n'].children['e'].completeWord).to.eq('one');
      expect(trie.children['o'].children['n'].children['e'].priority).to.eq(0);
      trie.select('one');
      expect(trie.children['o'].children['n'].children['e'].priority).to.eq(1);
    })

    it('should priortize selected words on subsequent suggestion', () => {
      trie.populate(dictionary);
      let suggestions = trie.suggest('piz');
      expect(suggestions).to.eql(['pize', 'pizza', 'pizzeria', 'pizzicato', 'pizzle'])
      trie.select('pizzle');
      let options = trie.suggest('piz')
      expect(options).to.eql(['pizzle','pize', 'pizza', 'pizzeria', 'pizzicato'])
    })
  })

  describe('delete', () => {
    it('should decrement the number of words in the trie', () => {
      trie.insert('sortingsuite');
      expect(trie.count).to.eq(1);
      trie.delete('sortingsuite');
      expect(trie.count).to.eq(0);
    })

    it('should remove an unwanted word from being suggested', () => {
      trie.populate(dictionary);
      let suggestions = trie.suggest('piz');
      expect(suggestions).to.eql(['pize', 'pizza', 'pizzeria', 'pizzicato', 'pizzle'])
      trie.delete('pizzle');
      let options = trie.suggest('piz')
      expect(options).to.eql(['pize', 'pizza', 'pizzeria', 'pizzicato'])
    })
  })


})