import Graphology from 'graphology';
import { Graph } from './graph.js';

export interface Colorable {
  color?: number;
}

export interface ColoringParameters {
  planar: boolean;
}

export function color(
  graph: Graphology.UndirectedGraph<Colorable>,
  parameters: Partial<ColoringParameters> = {}
) {
  const minor = new Graph(graph);

  const colorMinor = () => {
    if (minor.order === 0) {
      return;
    }

    const { node, degree, neighbors } = (() => {
      const node = (() => {
        if (parameters.planar) {
          for (let i = 0; i <= 5; i++) {
            const [node] = minor.class(i);
            if (node) return node;
          }
          throw new Error('graph is nonplanar');
        } else {
          const [entry] = minor.nodeEntries();
          return entry.node;
        }
      })();

      return { node, degree: minor.degree(node), neighbors: minor.neighbors(node) };
    })();

    if (degree === 5 && parameters.planar) {
      console.log(parameters.planar);
      const [source, target] = (() => {
        for (let i = 0; i < 5; i++) {
          for (let j = i + 1; j < 5; j++) {
            if (!minor.hasEdge(neighbors[i], neighbors[j])) {
              return [neighbors[i], neighbors[j]];
            }
          }
        }
        throw new Error('graph is nonplanar');
      })();

      minor.identify(source, target);
    }

    const merged = minor.getNodeAttributes(node).merged;

    minor.dropNode(node);
    colorMinor();

    const color = (() => {
      const used = new Set(neighbors.map((n) => graph.getNodeAttributes(n).color));
      const last = parameters.planar ? 4 : used.size;
      for (let i = 0; i < last; i++) {
        if (!used.has(i)) {
          return i;
        }
      }
      return last;
    })();

    merged.forEach((node) => {
      graph.setNodeAttribute(node, 'color', color);
    });
  };

  colorMinor();
}
