import { HTMLProps } from 'react';

// Componente de input de texto
const TextArea = ({ ...rest }: HTMLProps<HTMLTextAreaElement>) => {
  return (
    <textarea
      {...rest}
      className="h-40 w-full resize-none rounded-lg border-2 p-2 outline-none"
    ></textarea>
  );
};

export default TextArea;
