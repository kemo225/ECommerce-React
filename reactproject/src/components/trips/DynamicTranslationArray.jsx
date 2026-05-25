import React from 'react';
import { useFieldArray } from 'react-hook-form';
import { Button, Card } from 'react-bootstrap';
import { HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi';
import MultilingualInput from './MultilingualInput';

export default function DynamicTranslationArray({
  name,
  control,
  register,
  errors,
  label,
  addButtonLabel,
  syncLang,
  onSyncLangChange
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <div className="mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3 border-bottom border-secondary border-opacity-25 pb-2">
        <h6 className="mb-0 fw-bold text-white-50">{label}</h6>
        <Button 
          variant="outline-primary" 
          size="sm" 
          onClick={() => append({
            en: '',
            fr: '',
            ru: '',
            it: '',
            ro: '',
            es: '',
            de: '',
            bl: ''
          })}
          className="d-flex align-items-center gap-1"
        >
          <HiOutlinePlus /> {addButtonLabel || 'Add Item'}
        </Button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-4 bg-secondary bg-opacity-10 border border-secondary border-opacity-25 rounded text-muted small">
          No items added yet. Click the button above to add one.
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {fields.map((field, index) => (
            <Card key={field.id} className="bg-dark bg-opacity-25 border-secondary border-opacity-25 shadow-sm">
              <Card.Body className="p-3 d-flex gap-3 align-items-start">
                <div className="flex-grow-1">
                  <MultilingualInput
                    name={`${name}.${index}`}
                    register={register}
                    errors={errors}
                    label={`Item #${index + 1}`}
                    syncLang={syncLang}
                    onSyncLangChange={onSyncLangChange}
                  />
                </div>
                <Button 
                  variant="danger" 
                  size="sm" 
                  onClick={() => remove(index)}
                  className="mt-4 d-flex align-items-center justify-content-center"
                  style={{ width: '32px', height: '32px', borderRadius: '6px' }}
                  title="Remove Item"
                >
                  <HiOutlineTrash />
                </Button>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
