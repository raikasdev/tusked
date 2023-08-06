// From phanpy, licensed under the MIT license, consult LICENSE-MIT
// I recommend using bun to execute this
import fs from 'node:fs';

const { INSTANCES_SOCIAL_SECRET_TOKEN, MIN_USERS } = process.env;

const params = new URLSearchParams({
  count: '0',
  min_users: MIN_USERS ?? '100',
  sort_by: 'active_users',
  sort_order: 'desc',
});

const url = `https://instances.social/api/1.0/instances/list?${params.toString()}`;
const results = await fetch(url, {
  headers: {
    Authorization: `Bearer ${INSTANCES_SOCIAL_SECRET_TOKEN}`,
  },
});

const json = await results.json();
const names = json.instances.map((instance) => instance.name);

// Write to file
const path = './src/data/instances.json';
fs.writeFileSync(path, JSON.stringify(names), 'utf8');
