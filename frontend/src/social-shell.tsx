import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

type PanelName = 'settings' | 'messages' | null;

const PANELS = ['settings', 'messages'] as const;

function syncPanelState(activePanel: PanelName) {
  PANELS.forEach((panelName) => {
    const isOpen = activePanel === panelName;
    const menu = document.querySelector<HTMLElement>(`[data-shell-menu="${panelName}"]`);
    const toggle = document.querySelector<HTMLButtonElement>(`[data-shell-toggle="${panelName}"]`);
    const indicator = document.querySelector<HTMLElement>(`[data-shell-indicator="${panelName}"]`);

    if (menu) {
      menu.hidden = !isOpen;
    }
    if (toggle) {
      toggle.setAttribute('aria-expanded', String(isOpen));
    }
    if (indicator) {
      indicator.textContent = isOpen ? '−' : '+';
    }
  });
}

function ShellController() {
  const [activePanel, setActivePanel] = useState<PanelName>(null);

  useEffect(() => {
    syncPanelState(activePanel);
  }, [activePanel]);

  useEffect(() => {
    const toggleHandlers = PANELS.map((panelName) => {
      const toggle = document.querySelector<HTMLButtonElement>(`[data-shell-toggle="${panelName}"]`);
      if (!toggle) {
        return () => undefined;
      }

      const handler = () => {
        setActivePanel((current) => (current === panelName ? null : panelName));
      };

      toggle.addEventListener('click', handler);
      return () => toggle.removeEventListener('click', handler);
    });

    const outsideHandler = (event: MouseEvent) => {
      const target = event.target as Node;
      const panel = document.getElementById('social-shell-root');
      if (panel && !panel.contains(target)) {
        setActivePanel(null);
      }
    };

    document.addEventListener('mousedown', outsideHandler);
    return () => {
      toggleHandlers.forEach((cleanup) => cleanup());
      document.removeEventListener('mousedown', outsideHandler);
    };
  }, []);

  return null;
}

const rootElement = document.getElementById('social-shell-controls');

if (rootElement) {
  createRoot(rootElement).render(<ShellController />);
}
