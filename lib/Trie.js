import Node from './Node';

export default class Trie {
  constructor () {
    this.count = 0;
    this.children = {};
  }

  insert(data) {
    this.count++
    let splitData = data.split('')
    let currentNode = this.children;

    while (splitData.length) {
      let firstLetter = splitData.shift();
      if(!currentNode[firstLetter]) {
        currentNode[firstLetter] = new Node();
      }
      if(!splitData.length) {
        currentNode[firstLetter].completeWord = data
      }
      currentNode = currentNode[firstLetter].children;
    }
  }

  suggest(prefix) {
    let letters = prefix.split('');
    let currentLevel = this.children;
    let suggestions = [];
    while (letters.length) {
      let currentLetter = letters.shift()
      if (Object.keys(currentLevel).find(letter => letter === currentLetter)) {
        currentLevel = currentLevel[currentLetter].children
      }
    }
    let letterOptions  = Object.keys(currentLevel);
    const findWords = (array, level) => {
      array.forEach(letter => {
      let recursiveLevel = level;
        if(recursiveLevel[letter].completeWord) {
          if (recursiveLevel[letter].popularity  === 0) {
            suggestions.push(recursiveLevel[letter].completeWord)
          }
          else {
            suggestions.unshift(recursiveLevel[letter].completeWord)
          }
        }
        if(Object.keys(recursiveLevel[letter].children).length) {
          recursiveLevel = recursiveLevel[letter].children;
          findWords(Object.keys(recursiveLevel), recursiveLevel);
        }
      })
    }
    findWords(letterOptions, currentLevel)
    return suggestions;
  }

  populate(array) {
    array.forEach(word => {
      this.insert(word);
    })
  }

  select(string) {
    let letters = string.split('');
    let currentLevel = this.children;
    this.traverseDownward(currentLevel, letters)[letters[letters.length -1]].popularity++;
  }

  delete(string) {
    let letters = string.split('');
    let currentLevel = this.children;
    this.traverseDownward(currentLevel, letters)[letters[letters.length -1]].completeWord = false;
  }

  traverseDownward(object, array) {
    while (array.length > 1) {
      let currentLetter = array.shift()
      if (Object.keys(object).find(letter => letter === currentLetter)) {
        object = object[currentLetter].children
      }
    }
    return object;
  }
}

module.exports = Trie;