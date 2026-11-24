type Props = { html: string };

export const ChamberView = ({ html }: Props) => (
  <iframe
    key={html.length}
    title="chamber"
    srcDoc={html}
    allow="camera; fullscreen"
    sandbox="allow-scripts allow-same-origin"
    style={{ border: 0, width: '100%', height: '100%', background: '#000' }}
  />
);
