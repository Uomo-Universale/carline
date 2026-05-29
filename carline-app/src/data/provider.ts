// CarLine — data provider
// ══════════════════════════════════════════════════════════════════
// To switch to the real Veracross backend:
//   1. Complete VeracrossDataSource implementation
//   2. Replace the import below with:
//      import { VeracrossDataSource } from './VeracrossDataSource';
//   3. Update the dataSource line accordingly
// ══════════════════════════════════════════════════════════════════

import { MockDataSource } from './MockDataSource';
import type { DataSource } from './DataSource';

export const dataSource: DataSource = new MockDataSource();
