// src/app/tourist/profile/components/PaymentMethod.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import {
  CreditCard,
  Wallet,
  DollarSign,
  PlusCircle,
  Trash2,
} from "lucide-react";

interface PaymentMethodProps {
  userId: string;
}

type PaymentMethodType = {
  id: string;
  type: string;
  details: any;
  isDefault: boolean;
};

const PAYMENT_TYPES = {
  CREDIT_CARD: "credit_card",
  DIGITAL_WALLET: "online_payment",
  CASH: "cash",
};

const PaymentMethod: React.FC<PaymentMethodProps> = ({ userId }) => {
  const { t } = useTranslation("common");
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodType[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newPaymentType, setNewPaymentType] = useState<string>(
    PAYMENT_TYPES.CREDIT_CARD,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [defaultPaymentId, setDefaultPaymentId] = useState<string>("");
  const [cardForm, setCardForm] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });

  const fetchPaymentMethods = async () => {
    return [
      {
        id: "1",
        type: PAYMENT_TYPES.CREDIT_CARD,
        details: {
          cardNumber: "**** **** **** 4242",
          cardHolder: "John Doe",
          expiryDate: "12/25",
        },
        isDefault: true,
      },
      {
        id: "2",
        type: PAYMENT_TYPES.DIGITAL_WALLET,
        details: { provider: "PayPal", email: "john.doe@example.com" },
        isDefault: false,
      },
    ];
  };

  useEffect(() => {
    const loadPaymentMethods = async () => {
      try {
        const methods = await fetchPaymentMethods();
        setPaymentMethods(methods);
        const defaultMethod = methods.find((m) => m.isDefault);
        if (defaultMethod) setDefaultPaymentId(defaultMethod.id);
      } catch (error) {
        console.error("Error loading payment methods:", error);
      }
    };
    loadPaymentMethods();
  }, []);

  const handleAddPaymentMethod = async () => {
    setIsLoading(true);
    try {
      let newMethod: PaymentMethodType;
      if (newPaymentType === PAYMENT_TYPES.CREDIT_CARD) {
        newMethod = {
          id: String(Date.now()),
          type: PAYMENT_TYPES.CREDIT_CARD,
          details: {
            cardNumber: `**** **** **** ${cardForm.cardNumber.slice(-4)}`,
            cardHolder: cardForm.cardHolder,
            expiryDate: cardForm.expiryDate,
          },
          isDefault: paymentMethods.length === 0,
        };
      } else if (newPaymentType === PAYMENT_TYPES.DIGITAL_WALLET) {
        newMethod = {
          id: String(Date.now()),
          type: PAYMENT_TYPES.DIGITAL_WALLET,
          details: { provider: "Digital Wallet", email: "user@example.com" },
          isDefault: paymentMethods.length === 0,
        };
      } else {
        newMethod = {
          id: String(Date.now()),
          type: PAYMENT_TYPES.CASH,
          details: { note: "Pay in cash at the venue" },
          isDefault: paymentMethods.length === 0,
        };
      }
      setPaymentMethods((prev) => [...prev, newMethod]);
      if (paymentMethods.length === 0) setDefaultPaymentId(newMethod.id);
      setCardForm({ cardNumber: "", cardHolder: "", expiryDate: "", cvv: "" });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Error adding payment method:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemovePaymentMethod = (id: string) => {
    setPaymentMethods((prev) => prev.filter((method) => method.id !== id));
    if (id === defaultPaymentId && paymentMethods.length > 1) {
      const remainingMethods = paymentMethods.filter(
        (method) => method.id !== id,
      );
      setDefaultPaymentId(remainingMethods[0]?.id || '');
    }
  };

  const handleSetDefaultPayment = (id: string) => {
    setDefaultPaymentId(id);
    setPaymentMethods((prev) =>
      prev.map((method) => ({ ...method, isDefault: method.id === id })),
    );
  };

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case PAYMENT_TYPES.CREDIT_CARD:
        return <CreditCard className="w-5 h-5 mr-2 text-blue-500" />;
      case PAYMENT_TYPES.DIGITAL_WALLET:
        return <Wallet className="w-5 h-5 mr-2 text-green-500" />;
      case PAYMENT_TYPES.CASH:
      default:
        return <DollarSign className="w-5 h-5 mr-2 text-yellow-500" />;
    }
  };

  const renderPaymentMethodLabel = (method: PaymentMethodType) => {
    if (method.type === PAYMENT_TYPES.CREDIT_CARD) {
      return `${t("payment.card")} - ${method.details.cardNumber}`;
    } else if (method.type === PAYMENT_TYPES.DIGITAL_WALLET) {
      return `${method.details.provider}`;
    } else {
      return t("payment.cash");
    }
  };

  const renderPaymentMethodDetails = (method: PaymentMethodType) => {
    if (method.type === PAYMENT_TYPES.CREDIT_CARD) {
      return `${method.details.cardHolder} - ${method.details.expiryDate}`;
    } else if (method.type === PAYMENT_TYPES.DIGITAL_WALLET) {
      return method.details.email;
    } else {
      return t("payment.cashDescription");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => setIsAddDialogOpen(true)}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          {t("payment.addMethod")}
        </Button>
      </div>

      {paymentMethods.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>{t("payment.noMethods")}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className="flex items-center justify-between p-4 border rounded-md shadow-sm bg-white dark:bg-gray-800"
            >
              <div className="flex items-center space-x-4">
                <input
                  type="radio"
                  id={`payment-${method.id}`}
                  checked={method.id === defaultPaymentId}
                  onChange={() => handleSetDefaultPayment(method.id)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="flex items-center font-medium">
                    {getPaymentMethodIcon(method.type)}
                    <span>{renderPaymentMethodLabel(method)}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {renderPaymentMethodDetails(method)}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemovePaymentMethod(method.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <CreditCard className="w-6 h-6 mr-2 text-green-500" />
              {t("payment.addPaymentTitle")}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">{t("payment.selectType")}</h3>
              <div className="space-y-2">
                {[
                  {
                    type: PAYMENT_TYPES.CREDIT_CARD,
                    label: t("payment.creditCard"),
                    icon: <CreditCard />,
                  },
                  {
                    type: PAYMENT_TYPES.DIGITAL_WALLET,
                    label: t("payment.digitalWallet"),
                    icon: <Wallet />,
                  },
                  {
                    type: PAYMENT_TYPES.CASH,
                    label: t("payment.cash"),
                    icon: <DollarSign />,
                  },
                ].map(({ type, label, icon }) => (
                  <div key={type} className="flex items-center">
                    <input
                      type="radio"
                      id={`payment-type-${type}`}
                      value={type}
                      checked={newPaymentType === type}
                      onChange={() => setNewPaymentType(type)}
                      className="h-4 w-4 text-blue-600"
                    />
                    <Label
                      htmlFor={`payment-type-${type}`}
                      className="flex items-center ml-2 cursor-pointer"
                    >
                      {React.cloneElement(icon, {
                        className: "w-5 h-5 mr-2 text-gray-600",
                      })}
                      {label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {newPaymentType === PAYMENT_TYPES.CREDIT_CARD && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">{t("payment.cardNumber")}</Label>
                  <Input
                    id="cardNumber"
                    value={cardForm.cardNumber}
                    onChange={(e) =>
                      setCardForm((prev) => ({
                        ...prev,
                        cardNumber: e.target.value,
                      }))
                    }
                    placeholder="1234 5678 9012 3456"
                  />
                </div>
                <div>
                  <Label htmlFor="cardHolder">{t("payment.cardHolder")}</Label>
                  <Input
                    id="cardHolder"
                    value={cardForm.cardHolder}
                    onChange={(e) =>
                      setCardForm((prev) => ({
                        ...prev,
                        cardHolder: e.target.value,
                      }))
                    }
                    placeholder="John Doe"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate">
                      {t("payment.expiryDate")}
                    </Label>
                    <Input
                      id="expiryDate"
                      value={cardForm.expiryDate}
                      onChange={(e) =>
                        setCardForm((prev) => ({
                          ...prev,
                          expiryDate: e.target.value,
                        }))
                      }
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      type="password"
                      value={cardForm.cvv}
                      onChange={(e) =>
                        setCardForm((prev) => ({
                          ...prev,
                          cvv: e.target.value,
                        }))
                      }
                      placeholder="123"
                      maxLength={4}
                    />
                  </div>
                </div>
              </div>
            )}

            {newPaymentType === PAYMENT_TYPES.DIGITAL_WALLET && (
              <p className="text-sm text-gray-500">
                {t("payment.walletDescription")}
              </p>
            )}

            {newPaymentType === PAYMENT_TYPES.CASH && (
              <p className="text-sm text-gray-500">
                {t("payment.cashLongDescription")}
              </p>
            )}

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                {t("common.cancel")}
              </Button>
              <Button onClick={handleAddPaymentMethod} disabled={isLoading}>
                {isLoading ? t("common.processing") : t("common.save")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentMethod;
