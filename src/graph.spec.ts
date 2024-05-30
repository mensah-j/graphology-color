import { describe, expect, test } from 'vitest';
import { Graph } from './graph.js';

describe('graph', () => {
  const triangle = {
    nodes: [{ key: 'A' }, { key: 'B' }, { key: 'C' }],
    edges: [
      { source: 'A', target: 'B' },
      { source: 'B', target: 'C' },
      { source: 'C', target: 'A' }
    ]
  };

  const hexagon = {
    nodes: [{ key: 'A' }, { key: 'B' }, { key: 'C' }, { key: 'D' }, { key: 'E' }, { key: 'F' }],
    edges: [
      { source: 'A', target: 'B' },
      { source: 'B', target: 'C' },
      { source: 'C', target: 'D' },
      { source: 'D', target: 'E' },
      { source: 'E', target: 'F' },
      { source: 'F', target: 'A' }
    ]
  };

  test('adding node updates degree', () => {
    const graph = new Graph(triangle);

    graph.addNode('D');
    expect(graph.degree('D')).toBe(0);
  });

  test('adding node updates class', () => {
    const graph = new Graph(triangle);

    graph.addNode('D');
    expect(graph.class(0)).toContain('D');
  });

  test('dropping node updates class', () => {
    const graph = new Graph(triangle);

    graph.dropNode('A');
    for (let i = 0; i < 2; i++) {
      expect(graph.class(i)).not.toContain('A');
    }
  });

  test('getting degree of nonexistent node throws', () => {
    const graph = new Graph(triangle);
    expect(() => graph.degree('D')).toThrow();
  });

  test('adding edge updates degree', () => {
    const graph = new Graph(triangle);

    graph.addNode('D');
    graph.addEdge('A', 'D');
    expect(graph.degree('A')).toBe(3);
    expect(graph.degree('B')).toBe(2);
    expect(graph.degree('C')).toBe(2);
    expect(graph.degree('D')).toBe(1);
  });

  test('adding edge updates class', () => {
    const graph = new Graph(triangle);

    graph.addNode('D');
    graph.addEdge('A', 'D');
    expect(graph.class(0)).toEqual(new Set([]));
    expect(graph.class(1)).toEqual(new Set(['D']));
    expect(graph.class(2)).toEqual(new Set(['C', 'B']));
    expect(graph.class(3)).toEqual(new Set(['A']));
  });

  test('dropping edge updates degree', () => {
    const graph = new Graph(triangle);

    graph.dropEdge('A', 'B');
    expect(graph.degree('A')).toBe(1);
    expect(graph.degree('B')).toBe(1);
    expect(graph.degree('C')).toBe(2);
  });

  test('dropping edge updates class', () => {
    const graph = new Graph(triangle);

    graph.dropEdge('A', 'B');
    expect(graph.class(1)).toEqual(new Set(['A', 'B']));
    expect(graph.class(2)).toEqual(new Set(['C']));
  });

  test('merging nodes updates degree', () => {
    const graph = new Graph(triangle);

    graph.identify('A', 'B');
    expect(graph.degree('B')).toBe(1);
    expect(graph.degree('C')).toBe(1);
  });

  test('merging nodes updates degree', () => {
    const graph = new Graph(hexagon);

    graph.identify('A', 'D');
    expect(graph.degree('B')).toBe(2);
    expect(graph.degree('C')).toBe(2);
    expect(graph.degree('D')).toBe(4);
    expect(graph.degree('E')).toBe(2);
    expect(graph.degree('F')).toBe(2);
  });

  test('merging nodes updates class', () => {
    const graph = new Graph(hexagon);

    graph.identify('A', 'D');
    expect(graph.class(2)).toEqual(new Set(['B', 'C', 'E', 'F']));
    expect(graph.class(4)).toEqual(new Set(['D']));
  });

  test('merging nodes preserves information', () => {
    const graph = new Graph(hexagon);

    graph.identify('A', 'D');
    expect(new Set(graph.getNodeAttributes('D').merged)).toEqual(new Set(['D', 'A']));

    graph.identify('C', 'D');
    expect(new Set(graph.getNodeAttributes('D').merged)).toEqual(new Set(['D', 'A', 'C']));

    graph.identify('D', 'E');
    expect(new Set(graph.getNodeAttributes('E').merged)).toEqual(new Set(['A', 'C', 'D', 'E']));
  });
});
