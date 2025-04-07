import { Button } from '@/components/ui/Button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/Dialog';
import React from 'react';

interface BookingDetails {
  date: string;
  time: string;
  therapistName: string;
  serviceName: string;
  amount: number;
  currency: string;
}

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  bookingDetails: BookingDetails;
  isLoading: boolean;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  bookingDetails,
  isLoading,
}) => {
  const {
    date,
    time,
    therapistName,
    serviceName,
    amount,
    currency,
  } = bookingDetails;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>予約内容の確認</DialogTitle>
          <DialogDescription>
            以下の内容で予約を確定します。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="font-semibold">セラピスト</div>
            <div>{therapistName}</div>

            <div className="font-semibold">サービス</div>
            <div>{serviceName}</div>

            <div className="font-semibold">日時</div>
            <div>{`${date} ${time}`}</div>

            <div className="font-semibold">料金</div>
            <div>{amount.toLocaleString()} {currency}</div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            キャンセル
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? '処理中...' : '予約を確定する'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 