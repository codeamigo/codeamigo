import { useField } from 'formik';
import React, { InputHTMLAttributes } from 'react';

type InputFieldProps = InputHTMLAttributes<HTMLInputElement>;

const InputField: React.FC<Props & InputFieldProps> = (props) => {
  const [field, { error }] = useField(props);

  return (
    <div className="col-span-6 sm:col-span-4 mt">
      <label
        htmlFor={field.name}
        className="block text-sm font-medium text-gray-700"
      >
        {props.label}
      </label>
      <input
        {...field}
        type={props.type}
        name={field.name}
        id={field.name}
        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
      />
      {error && <div className="mt-1 text-xs text-red-600">{error}</div>}
    </div>
  );
};

type Props = {
  name: string;
  label: string;
};

export default InputField;
