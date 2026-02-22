import { getLangColor, formatCount } from './utils';
import type { Project, RepoConfig } from './types';

function Bone({ cls }: { cls: string }) {
  return <div className={`os-skeleton ${cls}`} />;
}

interface EditorialProps {
  projects: Project[];
  loading: boolean;
  configs: RepoConfig[];
}

export function Editorial({ projects, loading, configs }: EditorialProps) {
  return (
    <div>
      {loading
        ? configs.map((cfg, i) => (
            <div key={i} className="os-s2-item">
              <div className="os-s2-link" style={{ pointerEvents: 'none' }}>
                <div>
                  {cfg.type !== 'contributed to' && cfg.type !== 'project' && (
                    <>
                      <Bone cls="h-3 w-16 mb-2 rounded" />
                      <Bone cls="h-12 w-full rounded" />
                      <Bone cls="h-2 w-10 mt-2 rounded" />
                    </>
                  )}
                  <Bone cls="h-3 w-14 mt-3 rounded" />
                </div>
                <div>
                  <Bone cls="h-3 w-16 mb-2 rounded" />
                  <Bone cls="h-6 w-1/2 mb-3 rounded" />
                  <Bone cls="h-4 w-full mb-1 rounded" />
                  <Bone cls="h-4 w-5/6 rounded" />
                </div>
              </div>
            </div>
          ))
        : projects.map(p => {
            const showStat    = p.type !== 'contributed to' && p.type !== 'project';
            const metric      = p.stat ?? { count: p.stars, label: '★ Stars' };
            const isDownloads = !!p.stat;

            return (
              <div key={p.full_name} className="os-s2-item">
                <a
                  href={p.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="os-s2-link"
                >
                  {/* ── Left stat column ── */}
                  <div className="os-s2-stats-col">
                    {showStat && (
                      <>
                        <span className="os-s2-stars-label">
                          {isDownloads ? '↓ Downloads' : '★ Stars'}
                        </span>
                        <span className="os-s2-stars-big">{formatCount(metric.count)}</span>
                        <span className="os-s2-lang">{metric.label}</span>
                      </>
                    )}
                    {p.language && (
                      <span className="os-s2-lang-chip">
                        <span
                          className="os-lang-dot"
                          style={{ background: getLangColor(p.language) }}
                        />
                        {p.language}
                      </span>
                    )}
                  </div>

                  {/* ── Content column ── */}
                  <div className="os-s2-content">
                    {p.type && (
                      <span className={`os-s2-type-badge os-s2-type-badge--${p.type.replace(/\s+/g, '-')}`}>
                        {p.type}
                      </span>
                    )}
                    <h3 className="os-s2-name">{p.displayName ?? p.name}</h3>
                    {p.description && <p className="os-s2-desc">{p.description}</p>}
                  </div>

                  <div className="os-s2-arrow">→</div>
                </a>
              </div>
            );
          })
      }
    </div>
  );
}
