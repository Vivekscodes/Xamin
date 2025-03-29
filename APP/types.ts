import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  PdfScreen: undefined;
};

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type PdfScreenProps = NativeStackScreenProps<RootStackParamList, 'PdfScreen'>;
