import type { Registry } from '../../data/opensourceProjects';
import type { RepoConfig, GitHubRepo, RegistryStat, Project } from './types';

export async function fetchFromRubyGems(
  packageName: string,
  config: RepoConfig,
): Promise<Project | null> {
  try {
    const res = await fetch(
      `https://rubygems.org/api/v1/gems/${encodeURIComponent(packageName)}.json`,
    );

    if (!res.ok) return null;

    const d = await res.json();

    return {
      name:             d.name              as string,
      full_name:        `${config.owner}/${config.repo}`,
      description:      (d.info as string)  || null,
      stargazers_count: 0,
      language:         'Ruby',
      html_url:         (d.source_code_uri as string | null)
                          ?? (d.homepage_uri as string | null)
                          ?? `https://github.com/${config.owner}/${config.repo}`,
      displayName:      config.displayName,
      type:             config.type,
      stat:             { count: d.downloads as number, label: 'RubyGems' },
      stars:            0,
    };
  } catch {
    return null;
  }
}

export async function fetchFromGitHub(
  owner: string,
  repo: string,
): Promise<GitHubRepo | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: { Accept: 'application/vnd.github.v3+json' },
    });

    return res.ok ? (res.json() as Promise<GitHubRepo>) : null;
  } catch {
    return null;
  }
}

export async function fetchRegistryStat(
  registry: Exclude<Registry, 'rubygems'>,
  packageName: string,
): Promise<RegistryStat | null> {
  try {
    switch (registry) {
      case 'npm': {
        const res = await fetch(
          `https://api.npmjs.org/downloads/point/last-year/${encodeURIComponent(packageName)}`,
        );
        if (!res.ok) return null;

        const data = await res.json();

        return { count: data.downloads as number, label: 'npm / yr' };
      }

      case null: {
        return null;
      }
    }
  } catch {
    return null;
  }
}
