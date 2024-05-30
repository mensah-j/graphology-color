import Graphology from 'graphology';
import { AbstractGraph, SerializedGraph, Attributes } from 'graphology-types';

interface Mergeable {
  merged: string[];
}

export class Graph extends Graphology.UndirectedGraph<Mergeable> {
  private degrees = new Map<string, number>();
  private classes = new Map<number, Set<string>>();

  constructor(
    graph?:
      | AbstractGraph<Attributes, Attributes, Attributes>
      | Partial<SerializedGraph<Attributes, Attributes, Attributes>>
  ) {
    super({
      allowSelfLoops: false,
      multi: false
    });

    if (graph) {
      // @ts-expect-error: graphology types
      super.import(graph);
    }

    this.bind();
  }

  private bind() {
    this.degrees = new Map<string, number>();
    this.classes = new Map<number, Set<string>>();

    this.forEachNode((node) => {
      this.setNodeAttribute(node, 'merged', [node]);

      const degree = super.degree(node);
      this.degrees.set(node, degree);
      if (!this.classes.has(degree)) {
        this.classes.set(degree, new Set([node]));
      } else {
        this.classes.get(degree)?.add(node);
      }
    });

    this.on('nodeAdded', (node) => {
      this.degrees.set(node.key, 0);
      if (!this.classes.has(0)) {
        this.classes.set(0, new Set([node.key]));
      } else {
        this.classes.get(0)?.add(node.key);
      }
    });

    this.on('nodeDropped', (node) => {
      const degree = this.degrees.get(node.key);
      if (degree !== undefined) {
        this.classes.get(degree)?.delete(node.key);
      }
      this.degrees.delete(node.key);
    });

    const edgeModifiers = [
      {
        event: 'edgeAdded',
        delta: +1
      },
      {
        event: 'edgeDropped',
        delta: -1
      }
    ] as const;

    edgeModifiers.forEach(({ event, delta }) => {
      this.on(event, (edge) => {
        [edge.source, edge.target].forEach((node) => {
          if (this.hasNode(node)) {
            const degree = this.degrees.get(node);
            if (degree !== undefined) {
              this.degrees.set(node, degree + delta);

              if (!this.classes.has(degree + delta)) {
                this.classes.set(degree + delta, new Set());
              }

              this.classes.get(degree + delta)?.add(node);
              this.classes.get(degree)?.delete(node);
            }
          }
        });
      });
    });
  }

  public degree(node: string): number {
    const d = this.degrees.get(node);
    if (d !== undefined) {
      return d;
    } else {
      throw new Graphology.NotFoundGraphError(
        `PlanarGraph.degree: could not find the node '${node}' in the graph.`
      );
    }
  }

  public class(degree: number): Set<string> {
    const c = this.classes.get(degree);
    if (c !== undefined) {
      return c;
    } else {
      const empty = new Set<string>();
      this.classes.set(degree, empty);

      return empty;
    }
  }

  public identify(source: string, target: string) {
    if (this.hasNode(source) && this.hasNode(target)) {
      const neighborsU = this.neighbors(source);

      const merged = this.getNodeAttributes(target).merged;
      merged.push(...this.getNodeAttributes(source).merged);

      this.dropNode(source);

      neighborsU.forEach((node) => {
        if (!this.hasEdge(node, target) && node !== target) {
          this.addEdge(node, target);
        }
      });
    }
  }
}
