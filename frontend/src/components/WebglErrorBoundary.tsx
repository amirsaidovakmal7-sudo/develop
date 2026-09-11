import { Component, type ReactNode } from 'react';

interface Props {
  fallback: ReactNode;
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * TECH_TASK_REDISIGN.md п.73: if a WebGL scene fails to initialise (context
 * creation failure, driver issue, etc.) show a static fallback instead of a
 * blank section or a crashed page.
 */
export class WebglErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.warn('WebGL scene failed to render, using static fallback.', error);
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}
