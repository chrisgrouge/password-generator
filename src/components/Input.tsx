import type {TextFieldProps} from 'react-aria-components';
import { Label, TextField, Input} from 'react-aria-components';

interface TextInputProps extends TextFieldProps {
  /**
   * Whether the input is visually hidden or not.
   */
  hidden?: boolean;
  /**
   * The label for the input. Appears above the input.
   */
  label?: string;
}

const TextInput = ({
  hidden,
  label,
  ...props
}: TextInputProps) => {
  const classes = hidden
    ? 'sr-only bg-transparent text-transparent'
    : 'p-4 pb-3 pr-100 w-full bg-white rounded-md font-courier text-3xl leading-normal text-left break-all tracking-wider text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600';
  
  return (
    <TextField {...props}>
      <Label
        className='font-averta-bold font-normal mb-2 block'
      >
        {label}
      </Label>
      <Input
        className={classes}
      />
    </TextField>
  )
}

export default TextInput
