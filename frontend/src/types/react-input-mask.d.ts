declare module 'react-input-mask' {
  import * as React from 'react';
  export interface InputState {
    value: string;
  }
  export interface InputMaskProps extends React.InputHTMLAttributes<HTMLInputElement> {
    mask: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }
  const InputMask: React.FC<InputMaskProps>;
  export default InputMask;
}