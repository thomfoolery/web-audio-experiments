import React from 'react';
import ReactDOM from 'react-dom';

import styles from './styles.module.css';

const mountContainer = document.createElement('div');
document.body.appendChild(mountContainer);

function Modal({isOpen, onClose, children}) {
  return isOpen ? (
    <div className={styles.ModalContainer}>
      <div className={styles.ModalBackground} onClick={onClose} />
      <div className={styles.Modal}>{children}</div>
    </div>
  ) : null;
}

function ModalMount({isOpen, onClose, children}) {
  ReactDOM.render(
    <React.StrictMode>
      <Modal isOpen={isOpen} onClose={onClose}>
        {children}
      </Modal>
    </React.StrictMode>,
    mountContainer,
  );

  return null;
}

export default ModalMount;
