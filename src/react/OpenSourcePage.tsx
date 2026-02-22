import { useState, useEffect } from 'react';
import { Editorial } from './opensource/Editorial';
import { fetchFromRubyGems, fetchFromGitHub, fetchRegistryStat } from './opensource/fetchers';
import { readCache, writeCache } from './opensource/cache';
import type { RepoConfig } from './opensource/types';
import type { Project } from './opensource/types';

interface OpenSourcePageProps {
  projects: RepoConfig[];
}

export default function OpenSourcePage({ projects: configs }: OpenSourcePageProps) {
  const [repos, setRepos]     = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = readCache(configs);

    if (cached) {
      setRepos(cached);
      setLoading(false);

      return;
    }

    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);

    const results = await Promise.all(
      configs.map(async (config) => {
        const { owner, repo, registry, packageName, type } = config;
        const pkgName = packageName ?? repo;

        // RubyGems provides everything — skip GitHub entirely for gem projects
        if (registry === 'rubygems' && type !== 'contributed to') {
          return fetchFromRubyGems(pkgName, config);
        }

        // All other cases: GitHub + optional registry stat in parallel
        const [ghRes, stat] = await Promise.all([
          fetchFromGitHub(owner, repo),
          registry && registry !== 'rubygems' && type !== 'contributed to'
            ? fetchRegistryStat(registry, pkgName)
            : Promise.resolve(null),
        ]);

        if (!ghRes) return null;

        return {
          ...ghRes,
          displayName: config.displayName,
          type,
          stat,
          stars: ghRes.stargazers_count,
        } satisfies Project;
      }),
    );

    const valid = results.filter(Boolean) as Project[];

    valid.sort((a, b) => (b.stat?.count ?? b.stars) - (a.stat?.count ?? a.stars));

    writeCache(configs, valid);
    setRepos(valid);
    setLoading(false);
  }

  return <Editorial projects={repos} loading={loading} configs={configs} />;
}
