import * as React from "react";

export type DynamicOptions = {
  ssr?: boolean;
  loading?: () => React.ReactNode;
};

export default function dynamic<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T } | T>,
  options?: DynamicOptions,
): React.ComponentType<React.ComponentProps<T>> {
  const LazyComponent = React.lazy(async () => {
    const mod = await importFunc();
    return "default" in mod ? (mod as { default: T }) : { default: mod as T };
  });

  return function DynamicWrapper(props: React.ComponentProps<T>) {
    return (
      <React.Suspense fallback={options?.loading ? options.loading() : null}>
        <LazyComponent {...props} />
      </React.Suspense>
    );
  };
}
