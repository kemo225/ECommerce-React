import { useState } from 'react';
import { HiChevronDown } from 'react-icons/hi';
import styles from './FAQ.module.css';

export default function FAQ({ items }) {
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => setOpenId(openId === id ? null : id);

  return (
    <div className={styles.wrapper}>
      {items.map((item) => (
        <div key={item.id} className={`${styles.item} ${openId === item.id ? styles.open : ''}`}>
          <button className={styles.question} onClick={() => toggle(item.id)}>
            <span>{item.question}</span>
            <HiChevronDown className={styles.icon} />
          </button>
          <div className={styles.answerWrap}>
            <p className={styles.answer}>{item.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
