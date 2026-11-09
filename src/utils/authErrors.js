export function authError(code) {
  const messages = {
    "auth/email-already-in-use": "هذا البريد مسجّل مسبقاً",
    "auth/invalid-email": "البريد الإلكتروني غير صحيح",
    "auth/weak-password": "كلمة المرور ضعيفة (6 أحرف على الأقل)",
    "auth/invalid-credential": "البريد أو كلمة المرور غير صحيحة",
    "auth/user-not-found": "لا يوجد حساب بهذا البريد",
    "auth/wrong-password": "كلمة المرور غير صحيحة",
    "auth/too-many-requests": "محاولات كثيرة، حاول لاحقاً",
    "auth/network-request-failed": "مشكلة بالاتصال بالإنترنت",
  };
  return messages[code] || "حدث خطأ، حاول مرة أخرى";
}
