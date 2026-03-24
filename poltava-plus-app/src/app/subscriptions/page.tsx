import SubscriptionManager from '@/components/SubscriptionManager/SubscriptionManager';

export default function SubscriptionsPage() {
  return (
    <main  style={{ 
      backgroundColor: '#000000'
    }}>
      <div className="max-w-6xl mx-auto">
        <SubscriptionManager />
      </div>
    </main>
  );
}