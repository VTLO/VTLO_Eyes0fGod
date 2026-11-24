import { OBSERVATORY_HTML } from '@/assets/chambers/observatory.generated';
import { POINTCLOUD_HTML } from '@/assets/chambers/pointcloud.generated';
import { POSEFUSION_HTML } from '@/assets/chambers/posefusion.generated';

export type ChamberId = 'observatory' | 'vault' | 'convergence';

export type Chamber = { id: ChamberId; title: string; verse: string; html: string };

export const CHAMBERS: ReadonlyArray<Chamber> = [
  { id: 'observatory', title: 'Observatory', verse: 'Breath and pulse, read through the walls.', html: OBSERVATORY_HTML },
  { id: 'vault', title: 'Vault', verse: 'The room remembered as a cloud of points.', html: POINTCLOUD_HTML },
  { id: 'convergence', title: 'Convergence', verse: 'Light and radio agree on a single body.', html: POSEFUSION_HTML },
];
