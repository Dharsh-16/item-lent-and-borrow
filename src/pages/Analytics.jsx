import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Users,
  Award
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../utils/sampleData';
import { calculateItemStatus } from '../utils/dateUtils';
import { EmptyState } from '../components/common/EmptyState';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

export function Analytics() {
  const { items, friendsSummary } = useApp();
  const [dateRange, setDateRange] = useState('all'); // '30d' | '90d' | 'all'

  // Filter items by selected range
  const filteredItems = useMemo(() => {
    if (dateRange === 'all') return items || [];
    const now = new Date();
    const daysLimit = dateRange === '30d' ? 30 : 90;
    const cutoff = new Date(now.getTime() - daysLimit * 86400000);

    return (items || []).filter(item => {
      const recordedDate = new Date(item.dateLent || item.dateBorrowed);
      return recordedDate >= cutoff;
    });
  }, [items, dateRange]);

  // Overall KPIs
  const stats = useMemo(() => {
    const total = filteredItems.length;
    if (total === 0) {
      return { total: 0, returned: 0, active: 0, overdue: 0, returnRate: 0, overdueRate: 0, avgDuration: 0, lentCount: 0, borrowedCount: 0 };
    }

    let returnedCount = 0;
    let overdueCount = 0;
    let activeCount = 0;
    let lentCount = 0;
    let borrowedCount = 0;
    let totalDurationDays = 0;
    let itemsWithDuration = 0;

    filteredItems.forEach(item => {
      const status = calculateItemStatus(item);
      if ((item.type || 'lent') === 'lent') {
        lentCount++;
      } else {
        borrowedCount++;
      }

      if (item.dateReturned) {
        returnedCount++;
        const start = new Date(item.dateLent || item.dateBorrowed);
        const end = new Date(item.dateReturned);
        const diffDays = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));
        totalDurationDays += diffDays;
        itemsWithDuration++;
      } else {
        activeCount++;
        if (status.key === 'overdue') {
          overdueCount++;
        }
      }
    });

    const returnRate = Math.round((returnedCount / total) * 100);
    const overdueRate = activeCount > 0 ? Math.round((overdueCount / activeCount) * 100) : 0;
    const avgDuration = itemsWithDuration > 0 ? Math.round(totalDurationDays / itemsWithDuration) : 0;

    return {
      total,
      returned: returnedCount,
      active: activeCount,
      overdue: overdueCount,
      returnRate,
      overdueRate,
      avgDuration,
      lentCount,
      borrowedCount
    };
  }, [filteredItems]);

  // Category Distribution
  const categoryChartData = useMemo(() => {
    const map = {};
    filteredItems.forEach(item => {
      const c = item.category || 'Other';
      map[c] = (map[c] || 0) + 1;
    });

    return Object.entries(map).map(([name, value]) => {
      const catObj = CATEGORIES.find(c => c.id === name);
      return {
        name,
        value,
        color: catObj ? catObj.color : '#64748b'
      };
    }).sort((a, b) => b.value - a.value);
  }, [filteredItems]);

  // Top Borrowers Bar Data
  const topBorrowersData = useMemo(() => {
    return friendsSummary
      .map(f => ({
        name: f.name.split(' ')[0], // first name for clean axis
        fullName: f.name,
        active: f.activeCount,
        returned: f.returnedCount
      }))
      .slice(0, 6);
  }, [friendsSummary]);

  // Monthly / Period Lending Trend Data
  const timelineTrendData = useMemo(() => {
    return [
      { month: 'May', lent: 2, borrowed: 1, returned: 1 },
      { month: 'Jun', lent: 4, borrowed: 2, returned: 3 },
      { month: 'Jul', lent: 3, borrowed: 3, returned: 4 },
      { month: 'Aug', lent: 5, borrowed: 2, returned: 3 },
      { month: 'Sep', lent: 6, borrowed: 4, returned: 5 },
      { month: 'Oct', lent: 4, borrowed: 3, returned: 2 },
    ];
  }, []);

  return (
    <div>
      {/* Page Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
            Reports & Analytics
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Lending patterns, return completion rates, and borrower reliability metrics.
          </p>
        </div>

        {/* Date Range Selector */}
        <div style={{ display: 'flex', gap: '6px', backgroundColor: 'var(--bg-surface)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          {[
            { id: '30d', label: 'Last 30 Days' },
            { id: '90d', label: 'Last 90 Days' },
            { id: 'all', label: 'All Time' },
          ].map(r => (
            <button
              key={r.id}
              type="button"
              onClick={() => setDateRange(r.id)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: dateRange === r.id ? 'var(--primary)' : 'transparent',
                color: dateRange === r.id ? 'white' : 'var(--text-secondary)',
                fontWeight: dateRange === r.id ? 600 : 500,
                fontSize: '12.5px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <EmptyState
          icon={BarChart3}
          title="Insufficient Data"
          description="There are no items recorded in this date range to calculate metrics."
        />
      ) : (
        <>
          {/* Top KPI Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(195px, 1fr))',
            gap: '14px',
            marginBottom: '24px'
          }}>
            {/* Lending vs Borrowing Balance */}
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 500 }}>
                Lending Balance
              </div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--primary)', letterSpacing: '-0.02em' }}>
                {stats.lentCount >= stats.borrowedCount 
                  ? `+${stats.lentCount - stats.borrowedCount} Lent` 
                  : `-${stats.borrowedCount - stats.lentCount} Borrowed`}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                {stats.lentCount} lent • {stats.borrowedCount} borrowed
              </div>
            </div>

            <div className="card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 500 }}>
                Return Success Rate
              </div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#10b981', letterSpacing: '-0.02em' }}>
                {stats.returnRate}%
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                {stats.returned} of {stats.total} items retrieved
              </div>
            </div>

            <div className="card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 500 }}>
                Overdue Rate
              </div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: stats.overdueRate > 0 ? '#ef4444' : '#10b981', letterSpacing: '-0.02em' }}>
                {stats.overdueRate}%
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                {stats.overdue} overdue among {stats.active} active
              </div>
            </div>

            <div className="card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 500 }}>
                Average Duration
              </div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#0ea5e9', letterSpacing: '-0.02em' }}>
                {stats.avgDuration} <span style={{ fontSize: '15px', fontWeight: 500 }}>days</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Avg time before item returns
              </div>
            </div>

            <div className="card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 500 }}>
                Friends Network
              </div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                {friendsSummary.length}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Connected borrowers & lenders
              </div>
            </div>
          </div>

          {/* Middle Charts: Timeline Area Chart & Category Distribution */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
            gap: '20px',
            marginBottom: '24px'
          }}>
            {/* Lending & Return Trend */}
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '15.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Lending & Return Volume
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Monthly volume of lent vs returned items
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '12px', fontSize: '12px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }} />
                    <span>Lent</span>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0ea5e9' }} />
                    <span>Borrowed</span>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                    <span>Returned</span>
                  </span>
                </div>
              </div>

              <div style={{ width: '100%', height: '240px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timelineTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorLent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="colorBorrowed" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="colorReturned" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                    <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                    <YAxis allowDecimals={false} stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                    <Area type="monotone" dataKey="lent" name="Lent" stroke="var(--primary)" fillOpacity={1} fill="url(#colorLent)" strokeWidth={2} />
                    <Area type="monotone" dataKey="borrowed" name="Borrowed" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorBorrowed)" strokeWidth={2} />
                    <Area type="monotone" dataKey="returned" name="Returned" stroke="#10b981" fillOpacity={1} fill="url(#colorReturned)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Most Frequently Lent Categories */}
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '15.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Category Frequency
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Which asset categories get borrowed most often
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', height: '240px' }}>
                <div style={{ flex: 1, height: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryChartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={45}
                        paddingAngle={3}
                      >
                        {categoryChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--bg-surface)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '130px' }}>
                  {categoryChartData.slice(0, 5).map(c => (
                    <div key={c.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12.5px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: c.color }} />
                        <span style={{ color: 'var(--text-secondary)' }}>{c.name}</span>
                      </span>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{c.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Lower Chart: Top Borrowers Bar Chart */}
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '15.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Top Borrowers (Active vs Returned)
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Friends with the highest number of borrowed items
                </p>
              </div>
              <div style={{ display: 'flex', gap: '12px', fontSize: '12px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: 'var(--primary)' }} />
                  <span>Currently Borrowed</span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#10b981' }} />
                  <span>Returned</span>
                </span>
              </div>
            </div>

            <div style={{ width: '100%', height: '240px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topBorrowersData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                  <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                  <YAxis allowDecimals={false} stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="active" name="Active" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="returned" name="Returned" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
