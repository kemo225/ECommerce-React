import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { useFieldArray, Controller } from 'react-hook-form';
import MultilingualInput from './MultilingualInput';
import { HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi';

export default function DynamicTranslationArray({ control, name, label }) {
  const { fields, append, remove } = useFieldArray({ control, name });

  return (
    <div className="mb-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="mb-0">{label}</h6>
        <Button size="sm" variant="outline-primary" onClick={() => append({ translations: { en: '' } })}>
          <HiOutlinePlus /> Add
        </Button>
      </div>

      {fields.length === 0 && <div className="text-muted small">No items yet</div>}

      {fields.map((field, idx) => (
        <div key={field.id} className="mb-2">
          <div className="d-flex gap-2">
            <Controller
              control={control}
              name={`${name}.${idx}.translations`}
              render={({ field: f }) => (
                <MultilingualInput value={f.value} onChange={f.onChange} />
              )}
            />
            <Button variant="danger" size="sm" onClick={() => remove(idx)}>
              <HiOutlineTrash />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
