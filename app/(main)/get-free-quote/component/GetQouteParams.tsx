'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import type { GetQouteFormState } from '../lib/get-qoute-form';

export default function GetQuoteSearchParams({
  setFormData,
}: {
  setFormData: React.Dispatch<React.SetStateAction<GetQouteFormState>>;
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const orderType = searchParams.get('orderType');

    if (orderType === 'embroidery' || orderType === 'vector') {
      setFormData((prev) => ({
        ...prev,
        orderType,
      }));
    }
  }, [searchParams, setFormData]);

  return null;
}