"use client";

import { Component, type ReactNode } from "react";
import { ActionButton } from "@/components/atoms/ActionButton";

type PanelErrorBoundaryProps = {
  children: ReactNode;
  retryLabel: string;
  title: string;
};

type State = { hasError: boolean };

export class PanelErrorBoundary extends Component<PanelErrorBoundaryProps, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 rounded-card border border-hair bg-white p-6 text-center">
          <p className="text-heading-3 text-ink">{this.props.title}</p>
          <ActionButton
            type="button"
            variant="line"
            onClick={() => this.setState({ hasError: false })}
          >
            {this.props.retryLabel}
          </ActionButton>
        </div>
      );
    }
    return this.props.children;
  }
}
