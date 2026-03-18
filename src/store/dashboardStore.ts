import { create } from 'zustand';

export type ChartType = 'line' | 'bar' | 'pie' | 'area' | 'scatter' | 'composed' | 'radar';

export interface Filter {
  id: string;
  field: string;
  operator: 'equals' | 'contains' | 'greaterThan' | 'lessThan';
  value: string | number;
}

export interface KPI {
  id: string;
  title: string;
  value: string | number;
  trend?: string;
  isPositive?: boolean;
  type: 'Output' | 'Input' | 'Guardrail';
  description?: string;
}

export interface Widget {
  id: string;
  title: string;
  description?: string;
  type: ChartType;
  dataSourceUrl: string;
  sourceLink?: string;
  xAxisField: string;
  yAxisFields: string[];
  groupByField?: string;
  colSpan: number;
  rowSpan: number;
  filters: Filter[];
}

export interface Page {
  id: string;
  title: string;
  section: 'internal' | 'external' | 'overview';
  kpis?: KPI[];
  widgets: Widget[];
}

interface DashboardState {
  pages: Page[];
  addPage: (page: Page) => void;
  updatePage: (pageId: string, page: Partial<Page>) => void;
  deletePage: (pageId: string) => void;
  addWidget: (pageId: string, widget: Widget) => void;
  updateWidget: (pageId: string, widgetId: string, widget: Partial<Widget>) => void;
  deleteWidget: (pageId: string, widgetId: string) => void;
}

const initialPages: Page[] = [
  {
    id: 'overview-demography',
    title: 'Demography & Impact',
    section: 'overview',
    kpis: [
      { id: 'k2', title: 'Non-English Revenue', value: '68%', trend: '+5.2% YoY', isPositive: true, type: 'Output', description: 'Share of revenue from non-English markets' },
      { id: 'k3', title: 'Languages Supported', value: '34', trend: '+2', isPositive: true, type: 'Input', description: 'Total localized languages available' },
      { id: 'k1', title: 'Active Advertisers', value: '124.5K', trend: '+12.5% YoY', isPositive: true, type: 'Output', description: 'Total active advertisers globally' },
      { id: 'k_plat', title: 'Platforms Supported', value: '12', trend: '+1', isPositive: true, type: 'Input', description: 'Total platforms supported' },
    ],
    widgets: [
      {
        id: 'w1',
        title: 'Revenue by Language',
        description: 'Demonstrating the impact of localization on global revenue',
        type: 'bar',
        dataSourceUrl: 'bitable://revenue_by_language',
        sourceLink: 'https://example.com/source/revenue-by-language',
        xAxisField: 'language',
        yAxisFields: ['revenue'],
        colSpan: 12,
        rowSpan: 2,
        filters: [],
      },
      {
        id: 'w2',
        title: 'Advertiser Distribution',
        description: '3D View: Language, Product, and Users',
        type: 'bar',
        dataSourceUrl: 'bitable://advertiser_distribution_3d',
        sourceLink: 'https://example.com/source/advertiser-distribution',
        xAxisField: 'language',
        yAxisFields: ['TTAM', 'TTO', 'Promote', 'SMB', 'TTMS', 'S++'],
        colSpan: 6,
        rowSpan: 2,
        filters: [],
      },
      {
        id: 'w_loc',
        title: 'Ratio of Localized Pages vs English',
        description: 'Per product and language',
        type: 'bar',
        dataSourceUrl: 'bitable://localized_ratio',
        sourceLink: 'https://example.com/source/localized-ratio',
        xAxisField: 'product',
        yAxisFields: ['Localized', 'English'],
        colSpan: 6,
        rowSpan: 2,
        filters: [],
      },
    ],
  },
  {
    id: 'internal-productivity',
    title: 'Productivity & Efficiency',
    section: 'internal',
    kpis: [
      { id: 'k4', title: 'Total Workload (Words)', value: '45.2M', trend: '+18% YoY', isPositive: true, type: 'Output', description: 'Total weighted wordcount delivered' },
      { id: 'k9', title: 'Turnaround Time', value: '1.2 Days', trend: '-0.3 Days', isPositive: true, type: 'Input', description: 'Average SLA for UI strings' },
    ],
    widgets: [
      {
        id: 'w3',
        title: 'Wordcount by Vendor',
        description: 'Monthly weighted wordcount distribution across vendors',
        type: 'area',
        dataSourceUrl: 'bitable://wordcount_vendor',
        sourceLink: 'https://example.com/source/wordcount-vendor',
        xAxisField: 'month',
        yAxisFields: ['Vendor A', 'Vendor B', 'Vendor C'],
        colSpan: 8,
        rowSpan: 2,
        filters: [],
      },
      {
        id: 'w_urg',
        title: 'Urgent vs Standard Request Ratio',
        description: 'Distribution of request urgency',
        type: 'pie',
        dataSourceUrl: 'bitable://urgent_ratio',
        sourceLink: 'https://example.com/source/urgent-ratio',
        xAxisField: 'type',
        yAxisFields: ['volume'],
        colSpan: 4,
        rowSpan: 2,
        filters: [],
      },
      {
        id: 'w_prod1',
        title: 'Translation vs Non-Translation Tasks',
        description: 'Volume of different task types',
        type: 'pie',
        dataSourceUrl: 'bitable://task_types',
        sourceLink: 'https://example.com/source/task-types',
        xAxisField: 'type',
        yAxisFields: ['volume'],
        colSpan: 12,
        rowSpan: 2,
        filters: [],
      },
    ],
  },
  {
    id: 'internal-quality',
    title: 'Quality',
    section: 'internal',
    kpis: [
      { id: 'k6', title: 'Avg MQM Score', value: '96.4', trend: '+0.2', isPositive: true, type: 'Guardrail', description: 'Overall translation quality score' },
    ],
    widgets: [
      {
        id: 'w5',
        title: 'MQM Score by Target Language',
        description: 'Quality tracking across top tier languages',
        type: 'scatter',
        dataSourceUrl: 'bitable://mqm_scores',
        sourceLink: 'https://example.com/source/mqm-scores',
        xAxisField: 'language',
        yAxisFields: ['score', 'errorRate'],
        colSpan: 12,
        rowSpan: 2,
        filters: [],
      },
      {
        id: 'w_qt',
        title: 'Query Types Ratios',
        description: 'Distribution of query types',
        type: 'pie',
        dataSourceUrl: 'bitable://query_types',
        sourceLink: 'https://example.com/source/query-types',
        xAxisField: 'type',
        yAxisFields: ['volume'],
        colSpan: 4,
        rowSpan: 2,
        filters: [],
      },
      {
        id: 'w_qvl',
        title: 'Query Volume per Language and Type',
        description: 'Breakdown of queries by language and category',
        type: 'bar',
        dataSourceUrl: 'bitable://query_vol_lang',
        sourceLink: 'https://example.com/source/query-vol-lang',
        xAxisField: 'language',
        yAxisFields: ['Context', 'Grammar', 'Style'],
        colSpan: 8,
        rowSpan: 2,
        filters: [],
      },
    ],
  },
  {
    id: 'internal-costs',
    title: 'Costs & Budget',
    section: 'internal',
    kpis: [
      { id: 'k5', title: 'Budget Utilization', value: '82%', trend: '-4% MoM', isPositive: true, type: 'Guardrail', description: 'Sum(cost) / Total Budget' },
    ],
    widgets: [
      {
        id: 'w4',
        title: 'Budget vs Actual Spend (USD)',
        description: 'Monthly financial tracking',
        type: 'composed',
        dataSourceUrl: 'bitable://budget_data',
        sourceLink: 'https://example.com/source/budget-data',
        xAxisField: 'month',
        yAxisFields: ['budget', 'actual'],
        colSpan: 8,
        rowSpan: 2,
        filters: [],
      },
      {
        id: 'w_cost1',
        title: 'Cost per Product Area',
        description: 'Distribution of localization spend',
        type: 'bar',
        dataSourceUrl: 'bitable://cost_product',
        sourceLink: 'https://example.com/source/cost-product',
        xAxisField: 'product',
        yAxisFields: ['cost'],
        colSpan: 4,
        rowSpan: 2,
        filters: [],
      },
      {
        id: 'w_cost_ven',
        title: 'Costs per Vendor',
        description: 'Distribution of localization spend by vendor',
        type: 'bar',
        dataSourceUrl: 'bitable://cost_vendor',
        sourceLink: 'https://example.com/source/cost-vendor',
        xAxisField: 'vendor',
        yAxisFields: ['cost'],
        colSpan: 12,
        rowSpan: 2,
        filters: [],
      },
    ],
  },
  ...['TTAM', 'TTO', 'Promote', 'SMB', 'TTMS', 'S++ Brand ads'].map((prod, idx) => ({
    id: `external-${prod.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
    title: prod,
    section: 'external' as const,
    kpis: [
      { id: `k_err_${idx}`, title: `${prod} Error Rate`, value: '2.4%', trend: '-1.2%', isPositive: true, type: 'Guardrail' as const, description: 'Errors encountered during user journey' },
      { id: `k_csat_${idx}`, title: 'CSAT Clarity Score', value: '4.6/5', trend: '+0.1', isPositive: true, type: 'Output' as const, description: 'Language clarity dissatisfaction rate inverse' },
    ],
    widgets: [
      {
        id: `w_err_${idx}`,
        title: `${prod} Errors by Language`,
        description: 'Tracking localization-related drop-offs in user journey',
        type: 'bar' as const,
        dataSourceUrl: `bitable://${prod.toLowerCase().replace(/[^a-z0-9]/g, '')}_errors`,
        sourceLink: `https://example.com/source/${prod.toLowerCase().replace(/[^a-z0-9]/g, '')}-errors`,
        xAxisField: 'language',
        yAxisFields: ['errorCount'],
        colSpan: 6,
        rowSpan: 2,
        filters: [],
      },
      {
        id: `w_csat_${idx}`,
        title: 'CSAT Negative Feedback Trend',
        description: 'Monthly trend of localization-related complaints',
        type: 'line' as const,
        dataSourceUrl: `bitable://${prod.toLowerCase().replace(/[^a-z0-9]/g, '')}_csat_negative_trend`,
        sourceLink: `https://example.com/source/${prod.toLowerCase().replace(/[^a-z0-9]/g, '')}-csat`,
        xAxisField: 'month',
        yAxisFields: ['complaints'],
        colSpan: 6,
        rowSpan: 2,
        filters: [],
      },
    ],
  }))
];

export const useDashboardStore = create<DashboardState>((set) => ({
  pages: initialPages,
  addPage: (page) => set((state) => ({ pages: [...state.pages, page] })),
  updatePage: (pageId, updatedPage) => set((state) => ({
    pages: state.pages.map(p => p.id === pageId ? { ...p, ...updatedPage } : p)
  })),
  deletePage: (pageId) => set((state) => ({
    pages: state.pages.filter(p => p.id !== pageId)
  })),
  addWidget: (pageId, widget) => set((state) => ({
    pages: state.pages.map(p => p.id === pageId ? { ...p, widgets: [...p.widgets, widget] } : p)
  })),
  updateWidget: (pageId, widgetId, updatedWidget) => set((state) => ({
    pages: state.pages.map(p => p.id === pageId ? {
      ...p,
      widgets: p.widgets.map(w => w.id === widgetId ? { ...w, ...updatedWidget } : w)
    } : p)
  })),
  deleteWidget: (pageId, widgetId) => set((state) => ({
    pages: state.pages.map(p => p.id === pageId ? {
      ...p,
      widgets: p.widgets.filter(w => w.id !== widgetId)
    } : p)
  })),
}));
