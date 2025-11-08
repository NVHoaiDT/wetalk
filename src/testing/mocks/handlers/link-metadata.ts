import { HttpResponse, http } from 'msw';

import { LinkMetadata } from '@/types/api';

import { networkDelay } from '../utils';

// Mock data for different domains
const mockMetadata: Record<string, LinkMetadata> = {
  'motion.dev': {
    title: 'Motion — JavaScript & React animation library',
    description:
      'Motion (prev Framer Motion) is a fast, production-grade web animation library for React, JavaScript and Vue. Build smooth UI animations with examples, tutorials, and a tiny footprint.',
    images: [
      'https://framerusercontent.com/images/9IOwyTKAykVZTetDEOb7qh81ZQ.png',
    ],
    sitename: 'Motion',
    favicon:
      'https://framerusercontent.com/images/3aQX5dnH5Yqgsn98QXKF2ZXxIE.png',
    duration: 480,
    domain: 'motion.dev',
    url: 'https://motion.dev/',
    source: 'mock',
  },
  'github.com': {
    title: "GitHub: Let's build from here",
    description:
      'GitHub is where over 100 million developers shape the future of software, together. Contribute to the open source community, manage your Git repositories, review code like a pro, track bugs and features, power your CI/CD and DevOps workflows, and secure code before you commit it.',
    images: [
      'https://github.githubassets.com/images/modules/site/social-cards/github-social.png',
    ],
    sitename: 'GitHub',
    favicon: 'https://github.githubassets.com/favicons/favicon.svg',
    duration: 320,
    domain: 'github.com',
    url: 'https://github.com',
    source: 'mock',
  },
  'youtube.com': {
    title: 'YouTube',
    description:
      'Enjoy the videos and music you love, upload original content, and share it all with friends, family, and the world on YouTube.',
    images: ['https://www.youtube.com/img/desktop/yt_1200.png'],
    sitename: 'YouTube',
    favicon:
      'https://www.youtube.com/s/desktop/d743f786/img/favicon_144x144.png',
    duration: 0,
    domain: 'youtube.com',
    url: 'https://www.youtube.com',
    source: 'mock',
  },
  'stackoverflow.com': {
    title: 'Stack Overflow - Where Developers Learn, Share, & Build Careers',
    description:
      'Stack Overflow is the largest, most trusted online community for developers to learn, share​ ​their programming ​knowledge, and build their careers.',
    images: [
      'https://cdn.sstatic.net/Sites/stackoverflow/Img/apple-touch-icon@2.png',
    ],
    sitename: 'Stack Overflow',
    favicon: 'https://cdn.sstatic.net/Sites/stackoverflow/Img/favicon.ico',
    duration: 250,
    domain: 'stackoverflow.com',
    url: 'https://stackoverflow.com',
    source: 'mock',
  },
  default: {
    title: 'Web Page Preview',
    description:
      'This is a mock preview for the website. The actual metadata will be fetched from the real API.',
    images: ['https://via.placeholder.com/1200x630/4A90E2/ffffff?text=Preview'],
    sitename: 'Website',
    favicon: 'https://via.placeholder.com/64/4A90E2/ffffff?text=W',
    duration: 180,
    domain: 'example.com',
    url: '',
    source: 'mock',
  },
};

// Helper to extract domain from URL
const extractDomain = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return 'example.com';
  }
};

// Helper to generate mock metadata for any URL
const generateMockMetadata = (url: string): LinkMetadata => {
  const domain = extractDomain(url);

  // Check if we have specific mock data for this domain
  const domainKey = Object.keys(mockMetadata).find((key) =>
    domain.includes(key),
  );

  if (domainKey && domainKey !== 'default') {
    return {
      ...mockMetadata[domainKey],
      url: url,
    };
  }

  // Generate generic mock data
  const siteName =
    domain.split('.')[0].charAt(0).toUpperCase() +
    domain.split('.')[0].slice(1);

  return {
    title: `${siteName} - Website Title`,
    description: `Mock description for ${url}. This is a placeholder description that would normally be fetched from the actual website metadata.`,
    images: [
      `https://via.placeholder.com/1200x630/4A90E2/ffffff?text=${siteName}`,
    ],
    sitename: siteName,
    favicon: `https://via.placeholder.com/64/4A90E2/ffffff?text=${siteName.charAt(0)}`,
    duration: Math.floor(Math.random() * 500) + 100,
    domain: domain,
    url: url,
    source: 'mock',
  };
};

export const linkMetadataHandlers = [
  // Mock the jsonlink.io API
  http.get('https://jsonlink.io/api/extract', async ({ request }) => {
    await networkDelay();

    const url = new URL(request.url);
    const targetUrl = url.searchParams.get('url');

    if (!targetUrl) {
      return HttpResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 },
      );
    }

    // Simulate occasional errors for testing error states
    if (targetUrl.includes('error-test')) {
      return HttpResponse.json(
        { error: 'Failed to fetch metadata' },
        { status: 500 },
      );
    }

    const metadata = generateMockMetadata(targetUrl);

    return HttpResponse.json(metadata);
  }),
];
