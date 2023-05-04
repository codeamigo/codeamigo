import { Field, useField } from 'formik';
import React, { InputHTMLAttributes } from 'react';

type InputFieldProps = InputHTMLAttributes<HTMLInputElement>;

const InputField: React.FC<Props & InputFieldProps> = (props) => {
  const [field, { error }] = useField(props);

  return (
    <div className={`mt col-span-6 sm:col-span-4 ${props.className}`}>
      <label
        className="mb-1 block text-xs font-medium text-white"
        htmlFor={field.name}
      >
        {props.label}
      </label>
      <Field
        {...props}
        {...field}
        className="w-full rounded-md border-neutral-800 bg-black px-3 py-2 text-sm text-white !outline-0 !ring-0 transition-colors placeholder:text-xs placeholder:text-neutral-400 focus:border-neutral-700 disabled:opacity-50"
        component={props.component || 'input'}
        id={field.name}
        name={field.name}
        type={props.type}
      />
      {error && <div className="mt-1 text-xs text-neutral-500">🔥 {error}</div>}
    </div>
  );
};

type Props = {
  component?: 'input' | 'select' | 'textarea';
  label: string;
  name: string;
};

export default InputField;
