import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';

type LinkItem = {
  label: string;
  url: string;
};

type ConversationItem = {
  id: number;
  title: string;
  subtitle: string;
  url: string;
  deleteUrl: string;
  avatarUrl: string;
  updatedAt: string;
};

type ShellData = {
  conversations: ConversationItem[];
  settingsLinks: LinkItem[];
  csrfToken: string;
  nextUrl: string;
};

function useOutsideClose<T extends HTMLElement>(open: boolean, onClose: () => void) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open, onClose]);

  return ref;
}

function Panel({
  side,
  title,
  icon,
  open,
  onToggle,
  children,
}: {
  side: 'left' | 'right';
  title: string;
  icon: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  const ref = useOutsideClose<HTMLDivElement>(open, onToggle);

  return (
    <div className={`shell-panel shell-panel--${side}`} ref={ref}>
      <button className="shell-panel__toggle" type="button" onClick={onToggle}>
        <span>
          {icon} {title}
        </span>
        <span>{open ? '−' : '+'}</span>
      </button>
      {open ? <div className="shell-panel__menu">{children}</div> : null}
    </div>
  );
}

function App({ data }: { data: ShellData }) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);

  const sortedConversations = useMemo(() => data.conversations, [data.conversations]);

  return (
    <>
      <Panel
        side="left"
        title="Impostazioni"
        icon="⚙️"
        open={settingsOpen}
        onToggle={() => setSettingsOpen((current) => !current)}
      >
        {data.settingsLinks.map((link) => (
          <a key={link.url} className="shell-panel__link text-button" href={link.url}>
            {link.label}
          </a>
        ))}
      </Panel>

      <Panel
        side="right"
        title="Messaggi"
        icon="💬"
        open={messagesOpen}
        onToggle={() => setMessagesOpen((current) => !current)}
      >
        {sortedConversations.length === 0 ? (
          <p className="shell-panel__empty">Nessuna chat ancora disponibile.</p>
        ) : (
          sortedConversations.map((conversation) => (
            <div key={conversation.id} className="shell-panel__chat">
              <div className="shell-panel__chat-top">
                <a className="text-button" href={conversation.url}>
                  {conversation.title}
                </a>
                <form method="post" action={conversation.deleteUrl}>
                  <input type="hidden" name="csrfmiddlewaretoken" value={data.csrfToken} />
                  <input type="hidden" name="next" value={data.nextUrl} />
                  <button className="text-button text-button--danger" type="submit">
                    Elimina
                  </button>
                </form>
              </div>
              <span className="helper-text">{conversation.subtitle}</span>
              <span className="helper-text">{conversation.updatedAt}</span>
            </div>
          ))
        )}
      </Panel>
    </>
  );
}

const rootElement = document.getElementById('social-shell-root');
const dataElement = document.getElementById('social-shell-data');

if (rootElement && dataElement?.textContent) {
  const data = JSON.parse(dataElement.textContent) as ShellData;
  createRoot(rootElement).render(<App data={data} />);
}
