import { useNavigate } from 'react-router-dom';

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <section className="flex flex-wrap gap-3 pt-4">
      <button type="button" onClick={() => navigate('/daily-sales')} className="btn-primary px-6">
        Log today’s sales
      </button>
      <button type="button" onClick={() => navigate('/chat')} className="btn-outline px-6">
        Ask FinSmart AI
      </button>
      <button type="button" onClick={() => navigate('/monthly-finance')} className="btn-outline px-6">
        View monthly report
      </button>
    </section>
  );
}
