"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { type AnalyticsProperties, trackEngagement } from "@/lib/analytics-events";

type TrackedExternalLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  eventName: string;
  eventProperties?: AnalyticsProperties;
};

export function TrackedExternalLink({ children, eventName, eventProperties, onClick, ...props }: TrackedExternalLinkProps) {
  return (
    <a
      {...props}
      onClick={(event) => {
        trackEngagement(eventName, eventProperties);
        onClick?.(event);
      }}
    >
      {children}
    </a>
  );
}
