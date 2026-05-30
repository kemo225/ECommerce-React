import { Form, Button } from 'react-bootstrap';
import { useFieldArray } from 'react-hook-form';
import { HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi';

const SUPPORTED_LANGUAGES = ['en', 'fr', 'ru', 'it', 'ro', 'es', 'de', 'bl'];

function DynamicListSection({ title, control, fieldName }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: fieldName,
  });

  return (
    <div className="mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-semibold mb-0">{title}</h6>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => append({ translations: {} })}
        >
          <HiOutlinePlus className="me-2" /> Add Item
        </Button>
      </div>

      {fields.length === 0 ? (
        <p className="text-muted small">No items yet. Click "Add Item" to get started.</p>
      ) : (
        fields.map((field, index) => (
          <div key={field.id} className="bg-light p-3 rounded mb-3">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <h6 className="small mb-0 fw-semibold">Item {index + 1}</h6>
              <Button
                variant="link"
                size="sm"
                className="text-danger p-0"
                onClick={() => remove(index)}
              >
                <HiOutlineTrash />
              </Button>
            </div>

            {SUPPORTED_LANGUAGES.map(lang => (
              <Form.Group className="mb-2" key={`${fieldName}-${index}-${lang}`}>
                <Form.Label className="small">{lang.toUpperCase()}</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={`Text in ${lang}`}
                  defaultValue={field.translations?.[lang] || ''}
                  className="bg-white"
                />
              </Form.Group>
            ))}
          </div>
        ))
      )}
    </div>
  );
}

export default function Step3Lists({ control }) {
  return (
    <div>
      <h5 className="fw-bold mb-4">Trip Details Lists</h5>
      <p className="text-muted mb-4">Add highlights, includes, excludes, and what to bring (in multiple languages)</p>

      <DynamicListSection 
        title="Highlights" 
        control={control} 
        fieldName="highlights"
      />
      <DynamicListSection 
        title="Includes" 
        control={control} 
        fieldName="includes"
      />
      <DynamicListSection 
        title="Excludes" 
        control={control} 
        fieldName="excludes"
      />
      <DynamicListSection 
        title="What to Bring" 
        control={control} 
        fieldName="whatToBring"
      />
    </div>
  );
}
