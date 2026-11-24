import type { ChamberId } from './chambers';

const hrefFor = (id: ChamberId) => (id === 'live' ? '?chamber=live' : `chambers/${id}.html`);

export const ChamberLink = ({ id }: { id: ChamberId }) => (
  <a
    href={hrefFor(id)}
    target="_blank"
    rel="noopener"
    title={id === 'live' ? 'Open Live in its own window' : `Open ${id} full screen`}
    style={{ color: '#C15632', textDecoration: 'none', fontFamily: 'Courier New, monospace', fontSize: 14, padding: '0 8px' }}
  >
    {'↗'}
  </a>
);
