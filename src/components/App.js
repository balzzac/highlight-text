/* eslint-disable new-cap */
import React from 'react';
import ReactHtmlParser from 'react-html-parser';

import './App.css';
import {highlight} from '../utilities/highlight';

// Input ======================================================================
const str = `You will deliver new technology with an adorable puppy. Perfect!`;

const highlightsInput = [
  {startOffset: 4, endOffset: 20, color: '#d9f593', priority: 0},
  {startOffset: 17, endOffset: 31, color: '#e8e8e8', priority: 1},
  {startOffset: 40, endOffset: 48, color: '#d9f593', priority: 2},
  {startOffset: 37, endOffset: 55, color: '#BEE5FC', priority: 3},
  {startOffset: 56, endOffset: 64, color: '#F1CD8F', priority: 4},
];

// ============================================================================

/**
 * App react component
 * @return {jsx}
 */
function App() {
  const highlights = [...highlightsInput];
  return (
    <main className="l-main">
      <p>{ReactHtmlParser(highlight(str, highlights))}</p>
    </main>
  );
}

export default App;
