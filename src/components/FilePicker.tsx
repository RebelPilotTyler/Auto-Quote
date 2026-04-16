import { Text } from 'react-native';

export type FilePickerProps = {
  onFilesSelected: (files: string[]) => void;
};

export const FilePicker = (_: FilePickerProps) => {
  return <Text>File upload is available on web.</Text>;
};
