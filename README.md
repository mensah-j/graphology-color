<a name="readme-top"></a>

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

<!-- PROJECT LOGO -->

# Graphology Color

Graph coloring algorithms to be used with [**`graphology`**](https://graphology.github.io/).

[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<!-- ABOUT THE PROJECT -->

## Installation

```bash
npm install graphology-color
```

## Usage

- [color](#color)

### color

Colors a graph using a greedy algorithm. The number of colors used is at most one more than the maximum degree of a node in the graph, or at most 5 if the graph is known to be planar.

```ts
import { color } from 'graphology-color';

color(graph, { planar: true });
```

_Arguments_

- **graph** _UndirectedGraph\<Colorable\>_: The target graph. Each node should reserve an integer attribute named `color` to be written to.
- **parameters** _ColoringParameters_: The parameters determining the method of coloring. Currently, the only method supported is a greedy algorithm for general graphs. Setting the `planar` option to `true` for a planar graph will ensure that at most 5 colors are used.

> [!CAUTION]
> Setting **`planar`** to **`true`** on a nonplanar graph is likely, but not guaranteed, to throw. Use at your own risk.

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/mensah-j/graphology-color.svg?style=for-the-badge
[contributors-url]: https://github.com/mensah-j/graphology-color/graphs/contributors
[stars-shield]: https://img.shields.io/github/stars/mensah-j/graphology-color.svg?style=for-the-badge
[stars-url]: https://github.com/mensah-j/graphology-color/stargazers
[issues-shield]: https://img.shields.io/github/issues/mensah-j/graphology-color.svg?style=for-the-badge
[issues-url]: https://github.com/mensah-j/graphology-color/issues
[license-shield]: https://img.shields.io/github/license/mensah-j/graphology-color.svg?style=for-the-badge
[license-url]: https://github.com/mensah-j/graphology-color/blob/master/LICENSE
