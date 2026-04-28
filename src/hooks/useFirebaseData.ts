import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { 
  UserProfile, 
  Student, 
  Teacher, 
  Class, 
  Subject, 
  AttendanceRecord, 
  AppNotification, 
  Schedule 
} from '../types';
import { User as FirebaseUser } from 'firebase/auth';

export const useFirebaseData = (user: FirebaseUser | null, profile: UserProfile | null, activeTab: string) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [allSchedules, setAllSchedules] = useState<Schedule[]>([]);
  const [resources, setResources] = useState<any[]>([]);

  useEffect(() => {
    if (!user || !profile) return;

    const listeners: (() => void)[] = [];

    // Notifications (Always needed)
    const qNotif = query(
      collection(db, 'notifications'), 
      where('recipientId', '==', user.uid),
      orderBy('date', 'desc')
    );
    listeners.push(onSnapshot(qNotif, (snap) => {
      setNotifications(snap.docs.map(d => ({ id: d.id, ...d.data() } as AppNotification)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'notifications')));

    // Role-specific data fetched conditionally based on active module to save reads
    if (profile.role === 'admin') {
      if (activeTab === 'students' || activeTab === 'dashboard') {
        const qUsers = query(collection(db, 'users'), where('role', '==', 'student'));
        listeners.push(onSnapshot(qUsers, (snap) => {
           setStudents(snap.docs.map(d => ({ id: d.id, ...d.data() } as Student)));
        }, (err) => handleFirestoreError(err, OperationType.LIST, 'users_students')));
      }

      if (activeTab === 'teachers' || activeTab === 'dashboard') {
        const qUsers = query(collection(db, 'users'), where('role', '==', 'teacher'));
        listeners.push(onSnapshot(qUsers, (snap) => {
           setTeachers(snap.docs.map(d => ({ id: d.id, ...d.data() } as Teacher)));
        }, (err) => handleFirestoreError(err, OperationType.LIST, 'users_teachers')));
      }
      
      if (['classes', 'students', 'dashboard'].includes(activeTab)) {
        listeners.push(onSnapshot(collection(db, 'classes'), (snap) => {
          setClasses(snap.docs.map(d => ({ id: d.id, ...d.data() } as Class)));
        }, (err) => handleFirestoreError(err, OperationType.LIST, 'classes')));
      }
      
      if (['attendance', 'students', 'dashboard'].includes(activeTab)) {
        listeners.push(onSnapshot(collection(db, 'attendance'), (snap) => {
          setAttendanceRecords(snap.docs.map(d => ({ id: d.id, ...d.data() } as AttendanceRecord)));
        }, (err) => handleFirestoreError(err, OperationType.LIST, 'attendance')));
      }
      
      if (['subjects', 'teachers', 'classes'].includes(activeTab)) {
        listeners.push(onSnapshot(collection(db, 'subjects'), (snap) => {
          setSubjects(snap.docs.map(d => ({ id: d.id, ...d.data() } as Subject)));
        }, (err) => handleFirestoreError(err, OperationType.LIST, 'subjects')));

        listeners.push(onSnapshot(collection(db, 'resources'), (snap) => {
          setResources(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        }, (err) => handleFirestoreError(err, OperationType.LIST, 'resources')));
      }
      
      if (['classes', 'dashboard'].includes(activeTab)) {
        listeners.push(onSnapshot(collection(db, 'schedules'), (snap) => {
          setAllSchedules(snap.docs.map(d => ({ id: d.id, ...d.data() } as Schedule)));
        }, (err) => handleFirestoreError(err, OperationType.LIST, 'schedules')));
      }
    }

    return () => listeners.forEach(l => l());
  }, [user, profile, activeTab]);

  return {
    students,
    teachers,
    classes,
    subjects,
    attendanceRecords,
    notifications,
    allSchedules,
    resources
  };
};
