import Graphology from 'graphology';
import { describe, expect, test } from 'vitest';
import { Colorable, color } from './color.js';

describe('coloring', () => {
  test.each([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])(`K_%i`, (n: number) => {
    const Kn = new Graphology.UndirectedGraph<Colorable>();

    for (let i = 0; i < n; i++) {
      Kn.addNode(i);
    }

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        Kn.addEdge(i, j);
      }
    }

    color(Kn, { planar: false });
    expect(Kn).toBeColored();

    const colors = new Set<number | undefined>();
    Kn.forEachNode((node) => {
      colors.add(Kn.getNodeAttributes(node).color);
    });

    expect(colors).toHaveLength(n);
  });

  test('icosahedron', () => {
    const icosahedron = new Graphology.UndirectedGraph<Colorable>();
    for (let i = 0; i < 12; i++) {
      icosahedron.addNode(i);
    }

    for (let i = 1; i <= 5; i++) {
      icosahedron.addEdge(0, i);
      icosahedron.addEdge(i, ((i + 1) % 5) + 1);
    }

    for (let i = 1; i <= 5; i++) {
      icosahedron.addEdge(i, i + 5);
      icosahedron.addEdge(i, ((i + 1) % 5) + 5);
    }

    for (let i = 1; i <= 5; i++) {
      icosahedron.addEdge(i + 5, ((i + 1) % 5) + 5);
      icosahedron.addEdge(i + 5, 11);
    }

    color(icosahedron, { planar: true });

    expect(icosahedron).toBeColored();
    const colors = new Set<number | undefined>();
    icosahedron.forEachNode((node) => {
      colors.add(icosahedron.getNodeAttributes(node).color);
    });

    console.dir(icosahedron.export(), { depth: null });

    expect(colors).length.lessThanOrEqual(5);
  });
});
