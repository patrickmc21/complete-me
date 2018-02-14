import Node from './Node';

export default class Trie {
  constructor () {
    this.count = 0;
    this.children = {};
  }

  insert(word) {
    this.count++;
    let splitWord = word.split('');
    let currentNode = this.children;

    while (splitWord.length) {
      let firstLetter = splitWord.shift();

      if (!currentNode[firstLetter]) {
        currentNode[firstLetter] = new Node();
      }
      if (!splitWord.length) {
        currentNode[firstLetter].completeWord = word;
      }
      currentNode = currentNode[firstLetter].children;
    }
  }

  suggest(prefix) {
    let suggestions = [];
    let currentNode = this.findLastKnownNode(prefix);
    
    if (!currentNode) {
      return suggestions;
    }
    let letterOptions  = Object.keys(currentNode);

    return this.findWords(letterOptions, currentNode, suggestions);
  }

  findWords(keysArray, nodeLevel, suggestions) {
    keysArray.forEach(letter => {
      let recursiveNode = nodeLevel;

      if (recursiveNode[letter].completeWord) {
        if (recursiveNode[letter].popularity  === 0) {
          suggestions.push(recursiveNode[letter].completeWord);
        } else {
          suggestions.unshift(recursiveNode[letter].completeWord);
        }
      }
      if (Object.keys(recursiveNode[letter].children).length) {
        recursiveNode = recursiveNode[letter].children;
        this.findWords(Object.keys(recursiveNode), recursiveNode, suggestions);
      }
    });
    return suggestions;
  }

  findLastKnownNode(prefix) {
    let letters = prefix.split('');
    let currentNode = this.children;

    while (letters.length) {
      let currentLetter = letters.shift();

      if (Object.keys(currentNode).find(letter => letter === currentLetter)) {
        currentNode = currentNode[currentLetter].children;
      } else {
        return;
      }
    }
    return currentNode;
  }

  populate(array) {
    array.forEach(word => {
      this.insert(word);
    });
  }

  select(string) {
    let letters = string.split('');

    this.traverseDownward(letters)[letters[0]].popularity++;
  }

  delete(string) {
    let letters = string.split('');

    this.traverseDownward(letters)[letters[0]].completeWord = false;
  }

  traverseDownward(array) {
    let currentLevel = this.children;

    while (array.length > 1) {
      let currentLetter = array.shift();

      if (Object.keys(currentLevel).find(letter => letter === currentLetter)) {
        currentLevel = currentLevel[currentLetter].children;
      }
    }
    return currentLevel;
  }
}
