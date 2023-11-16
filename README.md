# telechart

Minimalistic charts without dependencies.

`telechart` is a lightweight, dependency-free library for rendering simple, responsive charts using canvas. Originally developed for a Telegram contest.

## About

The `telechart` library accepts input data and renders it as interactive charts. It was designed with simplicity and flexibility in mind, making it ideal for projects requiring straightforward charting solutions.

### Key Features

- No dependencies - Lean and fast, with no external dependencies.
- Multiple chart types - Supports line, area, and bar charts.
- Customizable - Easy to customize with colors, names, and more.
- Responsive and interactive - Designed to work across devices and offers interactive features like zooming.

## Data Structure

The library processes data in a specific format:

- **columns**: A list of all data columns in the chart. Each column starts with a label, followed by values. For example, x values are UNIX timestamps (in milliseconds).
- **types**: Defines the chart type for each column (line, area, bar, x).
- **colors**: Hex color codes for each variable (e.g., #AAAAAA).
- **names**: Names for each variable.
- **percentage**: Set to true for percentage-based values.
- **stacked**: Set to true for stacked values.
- **y_scaled**: Set to true for charts with two Y-axes.

### API Methods

`telechart` provides several methods for interacting with and controlling the rendered charts:

- **update**: Update the chart state with new data.
- **mount**: Attach chart elements to the DOM.
- **render**: Manually trigger a re-render of the chart. Accepts force and immediately flags.
- **onZoomIn**: Specify a callback function for zoom-in events.

## Getting Started

### Installation

```
npm i -S telechart
```

### Basic Usage

```js
const target = document.getElementById("demo");
const controller = telechart(data).mount(target);
```

## Contributing

### Run dev

```
npm start
```

### Run demo

```
npm run serve
```

## License

Telechart is open source software [licensed as MIT](LICENSE).
