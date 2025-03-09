import React from 'react';
import styles from './HeroMessage.module.css';

function HeroMessage() {
  return (
    <main id="main-home-page">
      <section className={styles.heroMessage}>
        <h1 className={styles.h1HomePage}>Bid it. Win it. Love it!</h1>
      </section>
    </main>
  );
}

export default HeroMessage;

