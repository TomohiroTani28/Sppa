import * as z from 'zod';

export const emailSchema = z.string().email('有効なメールアドレスを入力してください');

export const passwordSchema = z
  .string()
  .min(8, 'パスワードは8文字以上で入力してください')
  .regex(/[A-Z]/, 'パスワードには大文字を含める必要があります')
  .regex(/[a-z]/, 'パスワードには小文字を含める必要があります')
  .regex(/[0-9]/, 'パスワードには数字を含める必要があります');

export const phoneNumberSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, '有効な電話番号を入力してください');

export const cardNumberSchema = z
  .string()
  .regex(/^\d{16}$/, 'カード番号は16桁で入力してください');

export const expiryDateSchema = z
  .string()
  .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, '有効期限はMM/YY形式で入力してください');

export const cvvSchema = z
  .string()
  .regex(/^\d{3,4}$/, 'CVVは3桁または4桁で入力してください');

export const nameSchema = z
  .string()
  .min(1, '名前を入力してください')
  .max(50, '名前は50文字以内で入力してください');

export const bookingFormSchema = z.object({
  date: z.string().min(1, '日付を選択してください'),
  time: z.string().min(1, '時間を選択してください'),
  notes: z.string().optional(),
});

export const paymentFormSchema = z.object({
  cardNumber: cardNumberSchema,
  expiryDate: expiryDateSchema,
  cvv: cvvSchema,
  name: nameSchema,
});

export const profileFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone_number: phoneNumberSchema,
  nationality: z.string().min(1, '国籍を選択してください'),
  languages: z.array(z.string()).min(1, '少なくとも1つの言語を選択してください'),
  profilePicture: z.any().optional(),
  backgroundImage: z.any().optional(),
}); 