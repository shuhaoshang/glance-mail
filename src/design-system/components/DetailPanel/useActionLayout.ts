import { useLayoutEffect, useState } from 'react';
export function useActionLayout(mobile: boolean, layoutKey: string) {
  const [bar, setBar] = useState<HTMLElement | null>(null);
  const [stacked, setStacked] = useState(false);
  useLayoutEffect(() => {
    if (!bar || mobile) return;
    const measure = () => {
      if (!bar.clientWidth) return;
      const style = getComputedStyle(bar);
      const available =
        bar.clientWidth -
        parseFloat(style.paddingLeft) -
        parseFloat(style.paddingRight);
      const groups = Array.from(bar.children);
      const required =
        groups.reduce((sum, group) => {
          if (!group.hasAttribute('data-action-group'))
            return sum + group.getBoundingClientRect().width;
          const children = Array.from(group.children);
          return (
            sum +
            children.reduce(
              (width, child) => width + child.getBoundingClientRect().width,
              0,
            ) +
            Math.max(0, children.length - 1) *
              parseFloat(getComputedStyle(group).columnGap)
          );
        }, 0) +
        Math.max(0, groups.length - 1) * parseFloat(style.columnGap);
      setStacked(required > available);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(bar);
    Array.from(bar.children).forEach((group) => observer.observe(group));
    let active = true;
    document.fonts.ready.then(() => {
      if (active) measure();
    });
    measure();
    return () => {
      active = false;
      observer.disconnect();
    };
  }, [bar, mobile, layoutKey]);
  return { bar, setBar, stacked };
}
