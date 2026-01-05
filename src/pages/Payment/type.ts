import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStack } from '@/navigation/types';

export type PaymentScreenProps = NativeStackScreenProps<HomeStack, 'PaymentScreen'>;

export interface PaymentMethod {
  id: string;
  name: string;
  iconType: 'image' | 'custom';
  iconName?: string;
  iconColor?: string;
  imagePath?: any;
  balance?: string;
  selected?: boolean;
  integrated?: boolean;
  cardNumber?: string;
  cardType?: string;
}

export interface BankAccount {
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
}

export const INITIAL_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'zalopay',
    name: 'Ví Zalopay',
    iconType: 'custom',
    selected: false,
    integrated: false
  },
  {
    id: 'mblaos',
    name: 'MBLaos',
    iconType: 'custom',
    selected: true,
    integrated: true
  },
  {
    id: 'bidv',
    name: 'BIDV',
    iconType: 'custom',
    cardType: 'BIDV',
    integrated: false
  }
];
