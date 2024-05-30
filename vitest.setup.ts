import Graphology from 'graphology';
import { Colorable } from './src/color.js';
import { expect } from 'vitest';

expect.extend({
  toBeColored: (graph: Graphology.UndirectedGraph<Colorable>) => {
    for (const edge of graph.edgeEntries()) {
      const [a, b] = [edge.source, edge.target].map((node) => ({
        key: node,
        color: graph.getNodeAttributes(node).color
      }));

      [a, b].forEach((node) => {
        if (a.color === undefined) {
          return {
            pass: false,
            message: () => `expected node '${node.key}' be colored`
          };
        }
      });

      if (a.color === b.color) {
        return {
          pass: false,
          message: () =>
            `expected nodes '${a.key}' and '${b.key}' to be colored with different colors`
        };
      }
    }
    return { pass: true, message: () => '' };
  }
});
