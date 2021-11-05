import { Field, useField } from 'formik';
import React, { InputHTMLAttributes } from 'react';

type InputFieldProps = InputHTMLAttributes<HTMLInputElement>;

const InputField: React.FC<Props & InputFieldProps> = (props) => {
  const [field, { error }] = useField(props);

  return (
    <div className={`col-span-6 sm:col-span-4 mt ${props.className}`}>
      <label
        className="block text-xs font-medium text-text-primary"
        htmlFor={field.name}
      >
        {props.label}
      </label>
      <Field
        {...props}
        {...field}
        className="block mt-1 w-full sm:text-sm rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
        component={props.component || 'input'}
        id={field.name}
        name={field.name}
        type={props.type}
      />
      {error && <div className="mt-1 text-xs text-accent">🔥 {error}</div>}
    </div>
  );
};

type Props = {
  component?: 'input' | 'select' | 'textarea';
  label: string;
  name: string;
};

export default InputField;
