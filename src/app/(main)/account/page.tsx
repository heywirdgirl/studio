import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default async function AccountPage() {
  const { user } = useAuth();
  if (!user) return <div>Please log in</div>;

  const q = query(collection(db, 'orders'), where('userId', '==', user.uid));
  const querySnapshot = await getDocs(q);
  const orders = querySnapshot.docs.map(doc => doc.data());

  return (
    <div>
      <h1>Your Account</h1>
      <h2>Order History</h2>
      {orders.map((order, index) => (
        <div key={index}>
          <p>Order ID: {order.printfulOrderId}</p>
          <p>Total: ${order.totalAmount}</p>
        </div>
      ))}
    </div>
  );