declare module "components/left-side-pane" {
  export interface LeftSidePaneProps {
    onAccountClick: () => void;
    onChartClick: () => void;
    onDashboardClick?: () => void;
    className?: string;
  }
  export interface SidebarProps {
    currentStock: Stock;
    onShowTechnicals: () => void;
  }
  
  export const Sidebar: React.FC<SidebarProps>;
  export const LeftSidePane: React.FC<LeftSidePaneProps>;
}
