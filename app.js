import { Stage, Layer, Rect } from 'https://unpkg.com/react-konva@18/umd/react-konva.js';
const { useState, useRef, useEffect } = React;

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const COLORS = {
  fixture: 'lightblue',
  category: 'lightgreen',
  till: 'orange',
  entrance: 'red'
};

function Legend() {
  useEffect(() => {
    const legend = document.getElementById('legend');
    legend.innerHTML = '';
    Object.entries(COLORS).forEach(([key, color]) => {
      const div = document.createElement('div');
      div.innerHTML = `<span class="color-box" style="background:${color}"></span> ${key}`;
      legend.appendChild(div);
    });
  }, []);
  return null;
}

function LayoutGenerator() {
  const [rect, setRect] = useState(null);
  const [items, setItems] = useState([]);
  const stageRef = useRef();
  const isDrawing = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    if (rect) return; // do not allow drawing if layout exists
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    startPos.current = pos;
    setRect({ x: pos.x, y: pos.y, width: 0, height: 0 });
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current || !rect) return;
    const pos = e.target.getStage().getPointerPosition();
    const newRect = {
      x: startPos.current.x,
      y: startPos.current.y,
      width: pos.x - startPos.current.x,
      height: pos.y - startPos.current.y
    };
    setRect(newRect);
  };

  const handleMouseUp = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    generateItems();
  };

  const generateItems = () => {
    if (!rect) return;
    const itemsArr = [];
    // simple generation: random small rectangles inside layout
    for (let i = 0; i < 5; i++) {
      itemsArr.push({
        type: 'fixture',
        x: randomInt(rect.x + 10, rect.x + rect.width - 40),
        y: randomInt(rect.y + 10, rect.y + rect.height - 40),
        width: 30,
        height: 30
      });
    }
    for (let i = 0; i < 3; i++) {
      itemsArr.push({
        type: 'category',
        x: randomInt(rect.x + 10, rect.x + rect.width - 40),
        y: randomInt(rect.y + 10, rect.y + rect.height - 40),
        width: 30,
        height: 30
      });
    }
    itemsArr.push({
      type: 'till',
      x: rect.x + rect.width - 50,
      y: rect.y + 10,
      width: 40,
      height: 40
    });
    itemsArr.push({
      type: 'entrance',
      x: rect.x + 10,
      y: rect.y + rect.height - 50,
      width: 40,
      height: 40
    });
    setItems(itemsArr);
  };

  const handleRedo = () => {
    setRect(null);
    setItems([]);
  };

  const handleExport = () => {
    const stage = stageRef.current.getStage();
    const dataURL = stage.toDataURL({ pixelRatio: 2 });
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'landscape' });
    doc.addImage(dataURL, 'PNG', 10, 10, 260, 180);
    doc.save('layout.pdf');
  };

  useEffect(() => {
    document.getElementById('redoBtn').onclick = handleRedo;
    document.getElementById('pdfBtn').onclick = handleExport;
  });

  return (
    React.createElement(Stage, {
      width: 800,
      height: 600,
      ref: stageRef,
      onMouseDown: handleMouseDown,
      onMousemove: handleMouseMove,
      onMouseup: handleMouseUp,
    },
      React.createElement(Layer, null,
        rect && React.createElement(Rect, {
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
          stroke: 'black',
          dash: [4, 4]
        }),
        items.map((item, i) => React.createElement(Rect, {
          key: i,
          x: item.x,
          y: item.y,
          width: item.width,
          height: item.height,
          fill: COLORS[item.type],
          stroke: 'black'
        }))
      )
    )
  );
}

function App() {
  return React.createElement(React.Fragment, null,
    React.createElement(Legend, null),
    React.createElement(LayoutGenerator, null)
  );
}

ReactDOM.render(React.createElement(App), document.getElementById('container'));
