'use client';

import { useEffect } from 'react';

export default function logoutPage() {

  useEffect(() => {
    sessionStorage.setItem('token',"");
    sessionStorage.setItem('user_email',"");
    sessionStorage.setItem('user_name',"");
    sessionStorage.setItem('formData',"");
    sessionStorage.setItem('subscriptionType', "");
    window.location.href="/";
  });
  return <></>
}