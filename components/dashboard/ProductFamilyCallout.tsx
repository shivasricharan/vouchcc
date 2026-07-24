import { ArrowRight } from 'lucide-react';
import styles from './ProductFamilyCallout.module.css';

function GithubIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .7a11.5 11.5 0 0 0-3.64 22.4c.58.1.79-.25.79-.56v-2.23c-3.22.7-3.9-1.37-3.9-1.37-.52-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.72 1.27 3.38.97.1-.75.41-1.27.74-1.56-2.57-.29-5.27-1.28-5.27-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.47.11-3.05 0 0 .97-.31 3.16 1.18A10.95 10.95 0 0 1 12 6.1c.98 0 1.95.13 2.87.39 2.19-1.49 3.15-1.18 3.15-1.18.63 1.58.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.71 5.39-5.29 5.68.42.36.79 1.06.79 2.14v3.27c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .7Z" />
    </svg>
  );
}

export default function ProductFamilyCallout() {
  return (
    <aside className={styles.callout} aria-labelledby="starter-kit-heading">
      <div>
        <span>Local open-source foundation</span>
        <h2 id="starter-kit-heading">Want to inspect the engine or build your own version?</h2>
        <p>
          This is the richer operational Vouch demo. The Starter Kit is the transparent,
          local-first foundation: no signup, no backend and MIT licensed.
        </p>
      </div>
      <div className={styles.actions}>
        <a href="https://vouchstarterkit.netlify.app/" target="_blank" rel="noopener noreferrer">
          View Starter Kit <ArrowRight size={15} aria-hidden="true" />
        </a>
        <a
          className={styles.secondary}
          href="https://github.com/yourvouch/vouch-starter-kit"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GithubIcon /> Fork on GitHub
        </a>
        <a className={styles.pilot} href="https://yourvouch.com/#contact" target="_blank" rel="noopener noreferrer">
          Explore the commercial pilot
        </a>
      </div>
    </aside>
  );
}
