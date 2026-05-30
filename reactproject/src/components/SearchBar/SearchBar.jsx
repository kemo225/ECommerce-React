import { HiOutlineSearch } from 'react-icons/hi';
import styles from './SearchBar.module.css';

export default function SearchBar({ placeholder = 'Search destinations...', value, onChange }) {
  return (
    <div className={styles.wrapper}>
      <HiOutlineSearch className={styles.icon} />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={styles.input}
      />
    </div>
  );
}
