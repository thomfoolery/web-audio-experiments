import React, {useState} from 'react';

import styles from './styles.module.css';

function Edge({source, target}) {
  const {x: startX, y: startY} = source.position;
  const {x: endX, y: endY} = target.position;

  return <path d={`M${startX} ${startY} L${endX} ${endY}`} />;
}

function Node({name, position, isSelected, onClick}) {
  const classList = [styles.PatchGraphNode];

  if (isSelected) {
    classList.push(styles.PatchGraphNodeSelected);
  }

  return (
    <div
      onClick={onClick}
      className={classList.join(' ')}
      style={{left: position.x, top: position.y}}
    >
      {name}
    </div>
  );
}

function PatchGraph({patch}) {
  const [selectedNodeId, setSelectedNodeId] = useState(0);
  const nodeHash = patch.nodes.reduce((acc, node) => {
    return {
      ...acc,
      [node.id]: node,
    };
  }, []);

  return (
    <div className={styles.PatchGraph}>
      <svg xmlns="http://www.w3.org/2000/svg">
        {patch.edges.map(edge => (
          <Edge
            key={edge.id}
            source={nodeHash[edge.sourceId]}
            target={nodeHash[edge.targetId]}
          />
        ))}
      </svg>
      <main className={styles.PatchGraph}>
        {patch.nodes.map(node => (
          <Node
            {...node}
            key={node.id}
            isSelected={node.id === selectedNodeId}
            onClick={() => setSelectedNodeId(node.id)}
          />
        ))}
      </main>
      <pre>
        <code>{JSON.stringify(nodeHash[selectedNodeId].data, null, 2)}</code>
      </pre>
    </div>
  );
}

export default PatchGraph;
