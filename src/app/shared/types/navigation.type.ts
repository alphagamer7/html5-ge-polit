export interface VisitStatus {
  isVisited: boolean;
  pageType: string;
  hasError?: boolean;
}

export interface PageContent {
  index: number;
  path?: string;
  type: string;
  title: string;
  isVisited: boolean;
  activeState: {
    active: string;
    latest: string;
    visited: string;
  };
}
