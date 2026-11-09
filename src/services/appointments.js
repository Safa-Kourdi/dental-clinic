// import {
//   collection,
//   doc,
//   getDocs,
//   query,
//   where,
//   writeBatch,
//   serverTimestamp,
// } from "firebase/firestore";
// import { db } from "../firebase";

// export const slotId = (date, time) => `${date}_${time.replace(":", "")}`;

// export async function getBookedTimes(date) {
//   const q = query(collection(db, "slots"), where("date", "==", date));
//   const snap = await getDocs(q);
//   return snap.docs.map((d) => d.data().time);
// }

// export async function bookAppointment({ user, profile, service, date, time, notes }) {
//   const apptRef = doc(collection(db, "appointments"));
//   const batch = writeBatch(db);

//   batch.set(doc(db, "slots", slotId(date, time)), {
//     uid: user.uid,
//     date,
//     time,
//     appointmentId: apptRef.id,
//   });

//   batch.set(apptRef, {
//     patientId: user.uid,
//     patientName: profile?.name || user.displayName || "",
//     phone: profile?.phone || "",
//     service,
//     date,
//     time,
//     notes,
//     status: "pending",
//     createdAt: serverTimestamp(),
//   });

//   await batch.commit();
//   return apptRef.id;
// }

// export async function getMyAppointments(uid) {
//   const q = query(collection(db, "appointments"), where("patientId", "==", uid));
//   const snap = await getDocs(q);
//   return snap.docs
//     .map((d) => ({ id: d.id, ...d.data() }))
//     .sort((a, b) => (a.date + a.time < b.date + b.time ? 1 : -1));
// }

// export async function cancelAppointment(appt) {
//   const batch = writeBatch(db);
//   batch.update(doc(db, "appointments", appt.id), { status: "cancelled" });
//   batch.delete(doc(db, "slots", slotId(appt.date, appt.time)));
//   await batch.commit();
// }
import {
  collection,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

export const slotId = (date, time) => `${date}_${time.replace(":", "")}`;

export async function getBookedTimes(date) {
  const q = query(collection(db, "slots"), where("date", "==", date));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data().time);
}

export async function bookAppointment({ user, profile, service, date, time, notes }) {
  const apptRef = doc(collection(db, "appointments"));
  const batch = writeBatch(db);

  batch.set(doc(db, "slots", slotId(date, time)), {
    uid: user.uid,
    date,
    time,
    appointmentId: apptRef.id,
  });

  batch.set(apptRef, {
    patientId: user.uid,
    patientName: profile?.name || user.displayName ||  "",
    phone: profile?.phone || "",
    service,
    date,
    time,
    notes,
    status: "pending",
    createdAt: serverTimestamp(),
  });

  await batch.commit();
  return apptRef.id;
}

export async function getMyAppointments(uid) {
  const q = query(collection(db, "appointments"), where("patientId", "==", uid));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (a.date + a.time < b.date + b.time ? 1 : -1));
}

export async function cancelAppointment(appt) {
  const batch = writeBatch(db);
  batch.update(doc(db, "appointments", appt.id), { status: "cancelled" });
  batch.delete(doc(db, "slots", slotId(appt.date, appt.time)));
  await batch.commit();
}

// ---------- للممرضة والطبيب ----------

export async function getAllAppointments() {
  const snap = await getDocs(collection(db, "appointments"));
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (a.date + a.time > b.date + b.time ? 1 : -1));
}

export async function updateAppointmentStatus(appt, status) {
  const batch = writeBatch(db);
  batch.update(doc(db, "appointments", appt.id), { status });

  // الرفض والإلغاء بيحرّروا الوقت للحجز من جديد
  if (status === "cancelled" || status === "rejected") {
    batch.delete(doc(db, "slots", slotId(appt.date, appt.time)));
  }

  await batch.commit();
}