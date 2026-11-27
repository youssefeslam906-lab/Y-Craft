import React, { useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import {
  ArrowRight,
  Check,
  Copy,
  LogOut,
  Search,
  ShieldAlert,
  Trash2,
} from 'lucide-react';
import {
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
  OWNER_EMAIL,
} from '../firebase';
import { Language, SIMPLE_STUDIO_COPY } from '../data/studioData';

type OrderStatus = 'waiting' | 'contacted' | 'in_progress' | 'completed';

interface WaitingOrderRecord {
  id: string;
  name: string;
  contactInfo: string;
  websiteType: string;
  notes: string;
  status: OrderStatus;
  lang: Language;
  createdAt?: Timestamp | null;
}

interface HiddenAdminDashboardProps {
  onClose: () => void;
  lang: Language;
}

const STATUS_LABELS: Record<OrderStatus, { ar: string; en: string; style: string }> = {
  waiting: {
    ar: 'قيد الانتظار (Waiting)',
    en: 'Waiting',
    style: 'bg-[#F5E9DA] text-[#B92708] border-[#DFC0A8]',
  },
  contacted: {
    ar: 'تم التواصل',
    en: 'Contacted',
    style: 'bg-[#ECE6DC] text-[#4A3B33] border-[#D5C9B8]',
  },
  in_progress: {
    ar: 'جاري التنفيذ',
    en: 'In Progress',
    style: 'bg-[#E5ECE6] text-[#1F5135] border-[#C2D6C7]',
  },
  completed: {
    ar: 'مكتمل',
    en: 'Completed',
    style: 'bg-[#1E1714] text-[#FBF5EA] border-[#1E1714]',
  },
};

export const HiddenAdminDashboard: React.FC<HiddenAdminDashboardProps> = ({
  onClose,
  lang,
}) => {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [authReady, setAuthReady] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [orders, setOrders] = useState<WaitingOrderRecord[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const isVerifiedOwner = Boolean(
    user &&
      user.email?.toLowerCase() === OWNER_EMAIL &&
      user.emailVerified
  );

  const nicheMap = Object.fromEntries(
    SIMPLE_STUDIO_COPY[lang].niches.map((n) => [n.id, n.title])
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Bootstrap owner admin document and attach waiting_orders listener ONLY when verified owner is signed in
  useEffect(() => {
    if (!authReady || !isVerifiedOwner || !user) {
      setOrders([]);
      return;
    }

    let isMounted = true;
    setLoadingOrders(true);

    const adminRef = doc(db, 'admins', user.uid);
    getDoc(adminRef)
      .then((snap) => {
        if (!snap.exists()) {
          return setDoc(adminRef, {
            email: OWNER_EMAIL,
            createdAt: serverTimestamp(),
          });
        }
        return undefined;
      })
      .catch((error) => {
        handleFirestoreError(error, OperationType.WRITE, `admins/${user.uid}`);
      });

    const ordersQuery = query(
      collection(db, 'waiting_orders'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeOrders = onSnapshot(
      ordersQuery,
      (snapshot) => {
        if (!isMounted) return;
        const nextOrders: WaitingOrderRecord[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            name: String(data.name ?? ''),
            contactInfo: String(data.contactInfo ?? ''),
            websiteType: String(data.websiteType ?? 'custom'),
            notes: String(data.notes ?? ''),
            status: (data.status as OrderStatus) || 'waiting',
            lang: (data.lang as Language) || 'ar',
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt : null,
          };
        });
        setOrders(nextOrders);
        setLoadingOrders(false);
      },
      (error) => {
        setLoadingOrders(false);
        handleFirestoreError(error, OperationType.LIST, 'waiting_orders');
      }
    );

    return () => {
      isMounted = false;
      unsubscribeOrders();
    };
  }, [authReady, isVerifiedOwner, user]);

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      setAuthError(
        error instanceof Error ? error.message : 'فشل تسجيل الدخول عبر Google'
      );
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  const handleStatusChange = async (orderId: string, nextStatus: OrderStatus) => {
    const path = `waiting_orders/${orderId}`;
    try {
      await updateDoc(doc(db, 'waiting_orders', orderId), {
        status: nextStatus,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    const path = `waiting_orders/${orderId}`;
    try {
      await deleteDoc(doc(db, 'waiting_orders', orderId));
      setConfirmDeleteId(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const handleCopyContact = async (id: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      setCopiedId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      order.name.toLowerCase().includes(q) ||
      order.contactInfo.toLowerCase().includes(q) ||
      order.notes.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const countByStatus = (status: OrderStatus) =>
    orders.filter((o) => o.status === status).length;

  return (
    <div dir="rtl" className="min-h-screen bg-[#FBF5EA] text-[#1E1714]">
      <header className="sticky top-0 z-40 bg-[#FBF5EA]/95 backdrop-blur-md border-b border-[#E5D7C5]">
        <div className="max-w-[1160px] mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="font-display text-xl font-bold text-[#B92708]">Y-CRAFT</span>
            <span className="text-xs text-[#6B584E]">· لوحة تحكم المالك (Waiting Orders)</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[40px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#DECBB5] bg-[#FFFDF9] text-xs font-medium text-[#1E1714] hover:border-[#B92708] transition-colors whitespace-nowrap"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>رجوع للموقع</span>
            </button>

            {user && (
              <button
                type="button"
                onClick={handleSignOut}
                className="min-h-[40px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1E1714] text-[#FBF5EA] text-xs font-medium hover:bg-[#3A2E28] transition-colors whitespace-nowrap"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>خروج</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-[1160px] mx-auto px-5 sm:px-8 py-10">
        {!authReady ? (
          <div className="max-w-md mx-auto rounded-2xl bg-[#FFFDF9] border border-[#E5D7C5] p-8 text-center text-sm text-[#6B584E]">
            جاري التحقق من الهوية...
          </div>
        ) : !user ? (
          <div className="max-w-md mx-auto rounded-2xl bg-[#FFFDF9] border border-[#E5D7C5] p-7 sm:p-8 space-y-5 text-center">
            <div className="font-display text-2xl font-semibold text-[#1E1714]">
              دخول المالك فقط
            </div>
            <p className="text-sm text-[#4A3B33] leading-relaxed">
              هذه اللوحة مخفية ومخصصة لمالك استوديو Y-CRAFT فقط لعرض وإدارة طلبات الانتظار (Waiting Orders).
            </p>
            {authError && (
              <div className="text-xs text-[#B92708] bg-[#F5E9DA] border border-[#B92708]/30 rounded-lg p-3">
                {authError}
              </div>
            )}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full min-h-[44px] px-5 py-3 rounded-lg bg-[#B92708] hover:bg-[#991F05] text-[#FBF5EA] text-sm font-medium transition-colors"
            >
              تسجيل الدخول بحساب Google
            </button>
          </div>
        ) : !isVerifiedOwner ? (
          <div className="max-w-md mx-auto rounded-2xl bg-[#FFFDF9] border border-[#DFC0A8] p-7 sm:p-8 space-y-4 text-center">
            <div className="w-11 h-11 rounded-xl bg-[#F5E9DA] text-[#B92708] flex items-center justify-center mx-auto">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h2 className="font-display text-xl font-semibold text-[#1E1714]">
              غير مصرح بالدخول
            </h2>
            <p className="text-sm text-[#4A3B33] leading-relaxed">
              الحساب المسجل حالياً (<span className="font-mono-tabular">{user.email}</span>) لا يملك صلاحية عرض طلبات العملاء.
            </p>
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full min-h-[44px] px-5 py-2.5 rounded-lg bg-[#1E1714] text-[#FBF5EA] text-sm font-medium hover:bg-[#3A2E28] transition-colors"
            >
              تسجيل الخروج والتبديل لحساب المالك
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Summary Strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-xl bg-[#FFFDF9] border border-[#E5D7C5] p-4">
                <div className="text-xs text-[#6B584E]">قيد الانتظار (Waiting)</div>
                <div className="font-mono-tabular text-2xl font-semibold text-[#B92708] mt-1">
                  {countByStatus('waiting')}
                </div>
              </div>
              <div className="rounded-xl bg-[#FFFDF9] border border-[#E5D7C5] p-4">
                <div className="text-xs text-[#6B584E]">تم التواصل</div>
                <div className="font-mono-tabular text-2xl font-semibold text-[#1E1714] mt-1">
                  {countByStatus('contacted')}
                </div>
              </div>
              <div className="rounded-xl bg-[#FFFDF9] border border-[#E5D7C5] p-4">
                <div className="text-xs text-[#6B584E]">جاري التنفيذ</div>
                <div className="font-mono-tabular text-2xl font-semibold text-[#1E1714] mt-1">
                  {countByStatus('in_progress')}
                </div>
              </div>
              <div className="rounded-xl bg-[#FFFDF9] border border-[#E5D7C5] p-4">
                <div className="text-xs text-[#6B584E]">مكتمل</div>
                <div className="font-mono-tabular text-2xl font-semibold text-[#1E1714] mt-1">
                  {countByStatus('completed')}
                </div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#E5D7C5]">
              <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-lg bg-[#EFE4D4] border border-[#E5D7C5]">
                {(
                  [
                    { id: 'all', label: `الكل (${orders.length})` },
                    { id: 'waiting', label: 'Waiting' },
                    { id: 'contacted', label: 'تم التواصل' },
                    { id: 'in_progress', label: 'جاري التنفيذ' },
                    { id: 'completed', label: 'مكتمل' },
                  ] as const
                ).map((tab) => {
                  const active = statusFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setStatusFilter(tab.id)}
                      className={`min-h-[36px] px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                        active
                          ? 'bg-[#FFFDF9] text-[#1E1714] shadow-xs'
                          : 'text-[#6B584E] hover:text-[#1E1714]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-[#8E7A6E] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="بحث بالاسم أو الرقم..."
                  className="w-full min-h-[40px] pr-9 pl-3 py-2 rounded-lg bg-[#FFFDF9] border border-[#DFCEB9] text-xs text-[#1E1714] placeholder:text-[#8E7A6E] focus:outline-none focus:border-[#B92708]"
                />
              </div>
            </div>

            {/* Waiting Orders List */}
            {loadingOrders ? (
              <div className="py-12 text-center text-sm text-[#6B584E]">
                جاري تحميل الطلبات...
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="rounded-2xl bg-[#FFFDF9] border border-[#E5D7C5] p-10 text-center space-y-2">
                <div className="font-display text-lg font-semibold text-[#1E1714]">
                  لا توجد طلبات في هذه القائمة حالياً
                </div>
                <p className="text-xs text-[#6B584E]">
                  أي عميل يملأ نموذج الطلب في الموقع سيظهر هنا مباشرة في Waiting Orders.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const statusMeta = STATUS_LABELS[order.status] ?? STATUS_LABELS.waiting;
                  const formattedDate = order.createdAt
                    ? order.createdAt.toDate().toLocaleString('ar-EG', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })
                    : 'الآن';

                  return (
                    <div
                      key={order.id}
                      className="rounded-2xl bg-[#FFFDF9] border border-[#E5D7C5] p-5 sm:p-6 space-y-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <h3 className="font-display text-lg font-semibold text-[#1E1714]">
                              {order.name}
                            </h3>
                            <span
                              className={`text-[11px] font-medium px-2.5 py-0.5 rounded-md border ${statusMeta.style}`}
                            >
                              {statusMeta.ar}
                            </span>
                          </div>
                          <div className="text-xs text-[#6B584E] flex flex-wrap items-center gap-2">
                            <span className="font-medium text-[#B92708]">
                              {nicheMap[order.websiteType] || order.websiteType}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono-tabular">{formattedDate}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <select
                            aria-label="تغيير حالة الطلب"
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order.id, e.target.value as OrderStatus)
                            }
                            className="min-h-[38px] px-3 py-1.5 rounded-lg bg-[#FBF5EA] border border-[#DFCEB9] text-xs font-medium text-[#1E1714] focus:outline-none focus:border-[#B92708]"
                          >
                            <option value="waiting">قيد الانتظار (Waiting)</option>
                            <option value="contacted">تم التواصل</option>
                            <option value="in_progress">جاري التنفيذ</option>
                            <option value="completed">مكتمل</option>
                          </select>

                          {confirmDeleteId === order.id ? (
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleDeleteOrder(order.id)}
                                className="min-h-[38px] px-3 py-1.5 rounded-lg bg-[#B92708] text-[#FBF5EA] text-xs font-medium hover:bg-[#991F05]"
                              >
                                تأكيد الحذف
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(null)}
                                className="min-h-[38px] px-2.5 py-1.5 rounded-lg border border-[#DECBB5] text-xs text-[#4A3B33]"
                              >
                                إلغاء
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(order.id)}
                              aria-label="حذف الطلب"
                              className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-lg border border-[#DECBB5] text-[#6B584E] hover:text-[#B92708] hover:border-[#B92708] transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#EADFD0] text-sm">
                        <span className="text-xs text-[#6B584E]">التواصل:</span>
                        <span className="font-mono-tabular font-medium text-[#1E1714]" dir="ltr">
                          {order.contactInfo}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyContact(order.id, order.contactInfo)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-[#DECBB5] bg-[#FBF5EA] text-[11px] font-medium text-[#4A3B33] hover:border-[#B92708]"
                        >
                          {copiedId === order.id ? (
                            <>
                              <Check className="w-3 h-3 text-[#B92708]" />
                              <span>تم النسخ</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>نسخ</span>
                            </>
                          )}
                        </button>
                      </div>

                      {order.notes && (
                        <p className="text-sm text-[#3A2E28] bg-[#FBF5EA] border border-[#EADFD0] rounded-xl p-3.5 leading-relaxed">
                          {order.notes}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
