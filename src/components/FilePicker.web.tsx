import { ChangeEvent } from 'react';

export type FilePickerProps = {
  onFilesSelected: (files: string[]) => void;
};

export const FilePicker = ({ onFilesSelected }: FilePickerProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []).map((file) => file.name);
    onFilesSelected(files);
  };

  return <input type="file" multiple accept=".stl,.3mf,.obj" onChange={handleChange} />;
};
