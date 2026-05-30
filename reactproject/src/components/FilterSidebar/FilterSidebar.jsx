import { useEffect, useState, useTransition } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTripTypes } from '../../hooks/useTripTypes';
import styles from './FilterSidebar.module.css';

export default function FilterSidebar({ filters, onFilterChange }) {
  const { t } = useLanguage();
  const { data: tripTypesData, isLoading: isLoadingTypes } = useTripTypes();
  const tripTypes = Array.isArray(tripTypesData)
    ? tripTypesData
    : (tripTypesData?.data || []);
  const [, startTransition] = useTransition();

  const [search, setSearch] = useState(filters.search || '');
  const [typeId, setTypeId] = useState(filters.typeId || '');
  const [minPrice, setMinPrice] = useState(filters.minPrice || '');
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice || '');
  const [includeInactive, setIncludeInactive] = useState(filters.includeInactive || false);

  // Sync state to parent filters with a transition to avoid blocking input
  const updateParent = (key, val) => {
    startTransition(() => {
      onFilterChange((prev) => ({ ...prev, [key]: val, page: 1 }));
    });
  };

  const handleClear = () => {
    setSearch('');
    setTypeId('');
    setMinPrice('');
    setMaxPrice('');
    setIncludeInactive(false);
    onFilterChange({
      page: 1,
      pageSize: 6,
      search: '',
      typeId: '',
      minPrice: '',
      maxPrice: '',
      includeInactive: false,
    });
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h3 className={styles.title}>{t('search')}</h3>
        <button className={styles.clear} onClick={handleClear}>
          {t('cancel')}
        </button>
      </div>

      {/* Search Input */}
      <div className={styles.group}>
        <label className={styles.label}>{t('search')}</label>
        <input
          type="text"
          className={styles.input}
          placeholder={t('searchPlaceholder')}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            updateParent('search', e.target.value);
          }}
        />
      </div>

      {/* Trip Type Select */}
      <div className={styles.group}>
        <label className={styles.label}>{t('tripType')}</label>
        <select
          className={styles.select}
          value={typeId}
          onChange={(e) => {
            setTypeId(e.target.value);
            updateParent('typeId', e.target.value);
          }}
        >
          <option value="">{t('allTypes')}</option>
          {tripTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </div>

      {/* Min & Max Price */}
      <div className={styles.group}>
        <label className={styles.label}>{t('minPrice')}</label>
        <input
          type="number"
          className={styles.input}
          placeholder="0"
          value={minPrice}
          onChange={(e) => {
            setMinPrice(e.target.value);
            updateParent('minPrice', e.target.value);
          }}
        />
      </div>

      <div className={styles.group}>
        <label className={styles.label}>{t('maxPrice')}</label>
        <input
          type="number"
          className={styles.input}
          placeholder="10000"
          value={maxPrice}
          onChange={(e) => {
            setMaxPrice(e.target.value);
            updateParent('maxPrice', e.target.value);
          }}
        />
      </div>

      {/* Include Inactive */}
      <div className={styles.group}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={includeInactive}
            onChange={(e) => {
              setIncludeInactive(e.target.checked);
              updateParent('includeInactive', e.target.checked);
            }}
          />
          <span className={styles.checkmark} />
          {t('includeInactive')}
        </label>
      </div>
    </aside>
  );
}
