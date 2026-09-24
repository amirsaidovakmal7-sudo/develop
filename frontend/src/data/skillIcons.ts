import react from '../assets/skills/react.svg';
import javascript from '../assets/skills/javascript.svg';
import html5 from '../assets/skills/html5.svg';
import css3 from '../assets/skills/css3.svg';
import python from '../assets/skills/python.svg';
import django from '../assets/skills/django.svg';
import fastapi from '../assets/skills/fastapi.svg';
import postgresql from '../assets/skills/postgresql.svg';
import sqlite from '../assets/skills/sqlite.svg';
import telegram from '../assets/skills/telegram.svg';
import googlesheets from '../assets/skills/googlesheets.svg';
import linux from '../assets/skills/linux.svg';
import nginx from '../assets/skills/nginx.svg';
import git from '../assets/skills/git.svg';
import mysql from '../assets/skills/mysql.svg';
import redis from '../assets/skills/redis.svg';
import intellij from '../assets/skills/intellij.svg';
import docker from '../assets/skills/docker.svg';
import amocrm from '../assets/skills/amocrm.png';

export interface SkillIcon {
  id: string;
  title: string;
  src: string;
}

/** Real brand SVGs (vendored under src/assets/skills — see that folder's
 * source), not hand-built shapes — used by the About section's hover
 * flyout (see SkillIcons.tsx). */
const ICONS: Record<string, SkillIcon> = {
  react: { id: 'react', title: 'React', src: react },
  javascript: { id: 'javascript', title: 'JavaScript', src: javascript },
  html5: { id: 'html5', title: 'HTML5', src: html5 },
  css3: { id: 'css3', title: 'CSS', src: css3 },
  python: { id: 'python', title: 'Python', src: python },
  django: { id: 'django', title: 'Django', src: django },
  fastapi: { id: 'fastapi', title: 'FastAPI', src: fastapi },
  postgresql: { id: 'postgresql', title: 'PostgreSQL', src: postgresql },
  sqlite: { id: 'sqlite', title: 'SQLite', src: sqlite },
  telegram: { id: 'telegram', title: 'Telegram', src: telegram },
  googlesheets: { id: 'googlesheets', title: 'Google Sheets', src: googlesheets },
  linux: { id: 'linux', title: 'Linux', src: linux },
  nginx: { id: 'nginx', title: 'NGINX', src: nginx },
  git: { id: 'git', title: 'Git', src: git },
  mysql: { id: 'mysql', title: 'MySQL', src: mysql },
  redis: { id: 'redis', title: 'Redis', src: redis },
  intellij: { id: 'intellij', title: 'IntelliJ IDEA', src: intellij },
  docker: { id: 'docker', title: 'Docker', src: docker },
  amocrm: { id: 'amocrm', title: 'amoCRM', src: amocrm },
};

/** Which icons fly out for each About-section capability, in display order. */
export const CAPABILITY_ICON_IDS: Record<string, string[]> = {
  capabilityFrontend: ['react', 'javascript', 'html5', 'css3'],
  capabilityBackend: ['python', 'django', 'fastapi', 'intellij'],
  capabilityDatabase: ['postgresql', 'sqlite', 'mysql', 'redis'],
  capabilityAutomation: ['telegram', 'googlesheets', 'amocrm'],
  capabilityDeployment: ['linux', 'nginx', 'git', 'docker'],
};

export function getCapabilityIcons(key: string | null): SkillIcon[] {
  if (!key) return [];
  return (CAPABILITY_ICON_IDS[key] ?? []).map((id) => ICONS[id]).filter(Boolean);
}
