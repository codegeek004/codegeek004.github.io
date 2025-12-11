/* Portfolio interactivity:
   - attempt to load public repos from GitHub and render them as project cards.
   - if fetch fails or rate-limited, render manual fallback content shown in DOM.
   - simple utility: set current year, update github profile link.
*/

/* CONFIG: replace with your GitHub username and optionally add manual projects
   - GITHUB_USERNAME: GitHub handle to fetch public repos from
   - MANUAL_PROJECTS: list of objects to use as fallback or to always show additional projects
*/
const GITHUB_USERNAME = 'codegeek004'; // <- replace with your GitHub username

const MANUAL_PROJECTS = [
  {
    name: 'PhotosPurge',
    description: 'Google Photos migration & cleanup tool — Django, Celery, MySQL. Large migration automation.',
    html_url: 'https://github.com/codegeek004/PhotosPurge',
    homepage: '',
    thumbnail: 'assets/photospurge.jpg',
    topics: ['Django','Celery','MySQL']
  },
  {
    name: 'Authentication API',
    description: 'Secure DRF auth system with JWT, MFA and single-device enforcement.',
    html_url: 'https://github.com/codegeek004/auth-api',
    thumbnail: 'assets/auth-api.jpg',
    topics: ['DRF','Security','JWT']
  },
  // add more fallback projects here if desired
];

function createProjectCard(p) {
  const article = document.createElement('article');
  article.className = 'project-card';

  const img = document.createElement('img');
  img.className = 'project-thumb';
  img.alt = (p.name || 'project') + ' thumbnail';
  img.src = p.thumbnail || p.image || p.owner?.avatar_url || 'assets/placeholder.jpg';
  article.appendChild(img);

  const body = document.createElement('div');
  body.className = 'project-body';

  const title = document.createElement('h3');
  title.className = 'project-title';
  title.textContent = p.name || p.full_name || 'Untitled';
  body.appendChild(title);

  if (p.description) {
    const desc = document.createElement('p');
    desc.className = 'project-desc';
    desc.textContent = p.description;
    body.appendChild(desc);
  }

  const tagsWrap = document.createElement('div');
  tagsWrap.className = 'project-tags';
  const tags = (p.topics && p.topics.length) ? p.topics : (p.language ? [p.language] : []);
  tags.slice && tags.slice(0,6).forEach(t => {
    const span = document.createElement('span');
    span.className = 'tag';
    span.textContent = t;
    tagsWrap.appendChild(span);
  });
  body.appendChild(tagsWrap);

  const links = document.createElement('div');
  links.className = 'project-links';
  if (p.homepage) {
    const demo = document.createElement('a');
    demo.className = 'link';
    demo.href = p.homepage;
    demo.target = '_blank';
    demo.rel = 'noopener';
    demo.textContent = 'Live demo';
    links.appendChild(demo);
    links.appendChild(document.createTextNode(' '));
  }
  if (p.html_url) {
    const src = document.createElement('a');
    src.className = 'link';
    src.href = p.html_url;
    src.target = '_blank';
    src.rel = 'noopener';
    src.textContent = 'View source';
    links.appendChild(src);
  }
  body.appendChild(links);
  article.appendChild(body);
  return article;
}

async function loadGithubRepos() {
  const grid = document.getElementById('projects-grid');
  const fallback = document.getElementById('projects-fallback');

  // show fallback in DOM briefly to avoid empty state
  fallback && fallback.classList.remove('visually-hidden');

  // update profile link to your GitHub
  const prof = document.getElementById('github-profile');
  if (prof) prof.href = `https://github.com/${GITHUB_USERNAME}`;

  const url = `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`;

  try {
    const res = await fetch(url, { headers: { Accept: 'application/vnd.github+json' }});
    if (!res.ok) throw new Error('GitHub API ' + res.status);
    const repos = await res.json();

    // filter out forks, sort by updated
    const list = repos.filter(r => !r.fork).sort((a,b) => new Date(b.updated_at) - new Date(a.updated_at)).slice(0,12);

    // fetch topics for each repo (optional)
    const withTopics = await Promise.all(list.map(async r => {
      try {
        const t = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${r.name}/topics`, {
          headers: { Accept: 'application/vnd.github.mercy-preview+json' }
        });
        if (t.ok) {
          const tj = await t.json();
          r.topics = tj.names || [];
        }
      } catch(e) {
        r.topics = [];
      }
      // set thumbnail: try looking for repository social preview (not available via API reliably).
      // Use owner's avatar as fallback to keep card looking good.
      r.thumbnail = `https://opengraph.githubassets.com/1/${GITHUB_USERNAME}/${r.name}`; // often returns OG image
      return r;
    }));

    // clear fallback and render
    fallback && fallback.classList.add('visually-hidden');
    grid.innerHTML = '';
    if (withTopics.length === 0) {
      renderFallback(grid, fallback);
      return;
    }
    withTopics.forEach(r => {
      grid.appendChild(createProjectCard(r));
    });
  } catch (err) {
    // network error, CORS or rate-limit -> render manual fallback
    console.warn('GitHub repos load failed:', err.message);
    renderFallback(grid, fallback);
  }
}

function renderFallback(grid, fallback) {
  // show fallback cards (either from DOM or from MANUAL_PROJECTS array)
  if (!grid) return;
  grid.innerHTML = '';

  // first, try to use the fallback DOM block if present
  if (fallback) {
    const cards = fallback.querySelectorAll('.project-card');
    cards.forEach(c => grid.appendChild(c.cloneNode(true)));
    // then append manual projects (to allow more projects)
    MANUAL_PROJECTS.forEach(p => grid.appendChild(createProjectCard(p)));
  } else {
    MANUAL_PROJECTS.forEach(p => grid.appendChild(createProjectCard(p)));
  }
}

/* Boot */
document.addEventListener('DOMContentLoaded', () => {
  // set year
  const y = document.getElementById('current-year');
  if (y) y.textContent = new Date().getFullYear();

  // load repos (client-side)
  loadGithubRepos();
});

