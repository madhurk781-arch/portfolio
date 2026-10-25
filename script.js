// ==========================================================
// Portfolio Script
// ==========================================================

// 1. Projects Data
const projects = [
  {
    title: 'Python Programs Collection',
    description: 'Factorial, Fibonacci, Structure-to-Dictionary.',
    tech: ['Python'],
    github: 'https://github.com/madhurk781-arch/madhur_python-programs',
    live: ''
  },
  {
    title: 'Messy Python Code Improvement',
    description: 'messy script refactored with AI.',
    tech: ['Python', 'AI'],
    github: 'https://github.com/madhurk781-arch/madhur_messy-code-improvement',
    live: ''
  },
  {
    title: 'Bug Fixing Using Cursor AI',
    description: 'buggy program fixed with Cursor.',
    tech: ['Python', 'Cursor AI'],
    github: 'https://github.com/madhurk781-arch/bug-fixing-cursor',
    live: ''
  },
  {
    title: 'Interactive Quiz Application',
    description: 'Interactive Quiz Application built with HTML, CSS, and JavaScript.',
    tech: ['HTML', 'CSS', 'JavaScript'],
    github: 'https://github.com/madhurk781-arch/quiz-app',
    live: 'https://madhur-quiz-app.vercel.app/'
  },
  {
    title: 'Book Reading List Application',
    description: 'Book Reading List Application to manage and track reading progress.',
    tech: ['HTML', 'CSS', 'JavaScript'],
    github: '',
    live: ''
  }
];

// Expose globally for testing/inspection
window.projects = projects;

// Render Projects into #project-list
function renderProjects(items) {
  const projectList = document.getElementById('project-list');
  if (!projectList) return;

  projectList.innerHTML = '';

  if (!items || items.length === 0) {
    const noProjects = document.createElement('p');
    noProjects.className = 'no-projects';
    noProjects.textContent = 'No projects found';
    projectList.appendChild(noProjects);
    return;
  }

  items.forEach(project => {
    const card = document.createElement('div');
    card.className = 'project-card';

    // Title
    const titleEl = document.createElement('h3');
    titleEl.textContent = project.title;
    card.appendChild(titleEl);

    // Description
    const descEl = document.createElement('p');
    descEl.textContent = project.description;
    card.appendChild(descEl);

    // Tech Tags
    if (Array.isArray(project.tech) && project.tech.length > 0) {
      const techContainer = document.createElement('div');
      techContainer.className = 'project-tech';
      project.tech.forEach(techItem => {
        const tag = document.createElement('span');
        tag.className = 'tech-tag';
        tag.textContent = techItem;
        techContainer.appendChild(tag);
      });
      card.appendChild(techContainer);
    }

    // Links Container
    const linksContainer = document.createElement('div');
    linksContainer.className = 'project-links';

    // GitHub Link
    if (project.github && project.github.trim() !== '') {
      const githubLink = document.createElement('a');
      githubLink.href = project.github;
      githubLink.textContent = 'GitHub';
      githubLink.target = '_blank';
      githubLink.rel = 'noopener noreferrer';
      githubLink.className = 'btn btn-github';
      githubLink.setAttribute('role', 'button');
      linksContainer.appendChild(githubLink);
    }

    // Live Link (shown ONLY if live is not empty)
    if (project.live && project.live.trim() !== '') {
      const liveLink = document.createElement('a');
      liveLink.href = project.live;
      liveLink.textContent = 'Live';
      liveLink.target = '_blank';
      liveLink.rel = 'noopener noreferrer';
      liveLink.className = 'btn btn-live';
      liveLink.setAttribute('role', 'button');
      linksContainer.appendChild(liveLink);
    }

    card.appendChild(linksContainer);
    projectList.appendChild(card);
  });
}

// 2. Live Search Filtering
function initSearch() {
  const searchInput = document.getElementById('search');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();

    if (!query) {
      renderProjects(projects);
      return;
    }

    const filtered = projects.filter(project => {
      const titleMatch = (project.title || '').toLowerCase().includes(query);
      const descMatch = (project.description || '').toLowerCase().includes(query);
      const techMatch = Array.isArray(project.tech) && project.tech.some(t => t.toLowerCase().includes(query));
      return titleMatch || descMatch || techMatch;
    });

    renderProjects(filtered);
  });
}

// 3. Dark Mode & Hamburger Menu
function initNavigationAndTheme() {
  // Dark Mode Toggle
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    if (themeToggle) themeToggle.textContent = '☀️';
  } else if (savedTheme === 'light') {
    document.body.classList.remove('dark');
    if (themeToggle) themeToggle.textContent = '🌓';
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark');
      const isDark = document.body.classList.contains('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      themeToggle.textContent = isDark ? '☀️' : '🌓';
    });
  }

  // Hamburger Menu Toggle
  const menuBtn = document.getElementById('menu-btn');
  const navLinks = document.getElementById('nav-links');

  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    // Close menu when clicking nav link on mobile
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }
}

// 4. Chatbot
function initChatbot() {
  const chatMessages = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const chatSend = document.getElementById('chat-send');

  if (!chatMessages || !chatInput || !chatSend) return;

  let isSending = false;

  async function handleSend() {
    if (isSending) return;

    const message = chatInput.value.trim();
    if (!message) return;

    // Clear input
    chatInput.value = '';

    // Append user message
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-message user';
    userMsg.textContent = message;
    chatMessages.appendChild(userMsg);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Show "typing..." while waiting
    const typingMsg = document.createElement('div');
    typingMsg.className = 'chat-message bot typing-indicator';
    typingMsg.textContent = 'typing...';
    chatMessages.appendChild(typingMsg);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    isSending = true;
    chatSend.disabled = true;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: message })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error (${response.status})`);
      }

      const data = await response.json();
      typingMsg.remove();

      if (!data || typeof data.reply === 'undefined') {
        throw new Error('Invalid response structure');
      }

      const botMsg = document.createElement('div');
      botMsg.className = 'chat-message bot';
      botMsg.textContent = data.reply;
      chatMessages.appendChild(botMsg);
    } catch (err) {
      typingMsg.remove();

      const errorMsg = document.createElement('div');
      errorMsg.className = 'chat-message bot error';
      errorMsg.textContent = err.message || 'Sorry, something went wrong. Please try again later.';
      chatMessages.appendChild(errorMsg);
    } finally {
      isSending = false;
      chatSend.disabled = false;
      chatMessages.scrollTop = chatMessages.scrollHeight;
      chatInput.focus();
    }
  }

  chatSend.addEventListener('click', handleSend);

  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  });
}

// Initialize when DOM is ready
function init() {
  renderProjects(projects);
  initSearch();
  initNavigationAndTheme();
  initChatbot();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
