import { useState, type ComponentProps } from 'react';
import { TextInput } from './TextInput';

export function TextInputExample(args: ComponentProps<typeof TextInput>) {
  const [value, setValue] = useState(args.value ?? '');
  return (
    <TextInput
      {...args}
      value={value}
      onChange={(event) => {
        setValue(event.currentTarget.value);
        args.onChange?.(event);
      }}
    />
  );
}
