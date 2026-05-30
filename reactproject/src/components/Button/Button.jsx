import styles from './Button.module.css';

export default function Button({ children, variant = 'primary', size = 'md', as: Tag = 'button', className = '', ...props }) {
  return (
    <Tag className={`${styles.btn} ${styles[variant]} ${styles[size]} ${className}`} {...props}>
      {children}
    </Tag>
  );
}
