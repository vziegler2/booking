/**
 * Blog System Module
 * Handles markdown parsing and blog post display
 */

class BlogSystem {
    constructor() {
        this.posts = [];
        this.container = null;
        this.init();
    }

    async init() {
        this.container = document.getElementById('blog-container');
        if (!this.container) return;

        await this.loadPosts();
        this.renderPosts();
    }

    async loadPosts() {
        try {
            // In production, this would fetch from an API or static JSON
            const response = await fetch('/blog/posts.json');
            if (response.ok) {
                this.posts = await response.json();
            } else {
                // Fallback: load sample posts
                this.posts = this.getSamplePosts();
            }
        } catch (error) {
            console.warn('Could not load blog posts:', error);
            this.posts = this.getSamplePosts();
        }
    }

    getSamplePosts() {
        return [
            {
                slug: '2024-01-20-fiori-elements',
                title: 'SAP Fiori Elements: Schnelle App-Entwicklung mit wenig Code',
                date: '2024-01-20',
                author: 'SAP Developer',
                category: 'Fiori',
                tags: ['Fiori', 'UI5', 'RAP', 'CDS'],
                excerpt: 'Erfahren Sie, wie Sie mit Fiori Elements und dem ABAP RESTful Application Programming Model moderne Apps in Rekordzeit erstellen.',
                readTime: 8
            },
            {
                slug: '2024-01-15-abap-clean-code',
                title: 'Clean Code in ABAP: Best Practices für wartbaren Code',
                date: '2024-01-15',
                author: 'SAP Developer',
                category: 'ABAP',
                tags: ['ABAP', 'Clean Code', 'Best Practices'],
                excerpt: 'Lernen Sie die wichtigsten Clean Code Prinzipien für ABAP-Entwicklung kennen und verbessern Sie die Wartbarkeit Ihres Codes.',
                readTime: 6
            }
        ];
    }

    renderPosts() {
        if (!this.container || this.posts.length === 0) return;

        const html = this.posts.map(post => `
            <article class="blog-card" data-category="${post.category}">
                <div class="blog-card-header">
                    <span class="blog-category">${post.category}</span>
                    <span class="blog-date">${this.formatDate(post.date)}</span>
                </div>
                <h3 class="blog-title">
                    <a href="#blog/${post.slug}">${post.title}</a>
                </h3>
                <p class="blog-excerpt">${post.excerpt}</p>
                <div class="blog-meta">
                    <span class="blog-author">Von ${post.author}</span>
                    <span class="blog-read-time">${post.readTime} min Lesezeit</span>
                </div>
                <div class="blog-tags">
                    ${post.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
                </div>
                <a href="#blog/${post.slug}" class="blog-read-more">
                    Weiterlesen <span>→</span>
                </a>
            </article>
        `).join('');

        this.container.innerHTML = html;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const lang = document.documentElement.lang || 'de';
        return new Intl.DateTimeFormat(lang, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    }

    async loadPost(slug) {
        try {
            const response = await fetch(`/blog/${slug}.md`);
            if (!response.ok) throw new Error('Post not found');

            const markdown = await response.text();
            return this.parseMarkdown(markdown);
        } catch (error) {
            console.error('Could not load post:', error);
            return null;
        }
    }

    parseMarkdown(markdown) {
        // Extract front matter
        const frontMatterMatch = markdown.match(/^---\n([\s\S]*?)\n---/);
        let frontMatter = {};
        let content = markdown;

        if (frontMatterMatch) {
            const frontMatterText = frontMatterMatch[1];
            content = markdown.replace(frontMatterMatch[0], '');

            // Parse YAML-like front matter
            frontMatterText.split('\n').forEach(line => {
                const [key, ...valueParts] = line.split(':');
                if (key && valueParts.length) {
                    let value = valueParts.join(':').trim();
                    // Handle arrays
                    if (value.startsWith('[') && value.endsWith(']')) {
                        value = value.slice(1, -1).split(',').map(v => v.trim().replace(/"/g, ''));
                    } else {
                        value = value.replace(/"/g, '');
                    }
                    frontMatter[key.trim()] = value;
                }
            });
        }

        // Simple markdown to HTML conversion
        content = this.markdownToHtml(content);

        return { frontMatter, content };
    }

    markdownToHtml(markdown) {
        return markdown
            // Headers
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            // Bold
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Italic
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            // Code blocks
            .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
            // Inline code
            .replace(/`(.*?)`/g, '<code>$1</code>')
            // Links
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
            // Lists
            .replace(/^\- (.*$)/gim, '<li>$1</li>')
            // Paragraphs
            .replace(/\n\n/g, '</p><p>')
            // Horizontal rules
            .replace(/^---$/gim, '<hr>');
    }

    filterByCategory(category) {
        if (!category || category === 'all') {
            this.renderPosts();
            return;
        }

        const filtered = this.posts.filter(p => p.category.toLowerCase() === category.toLowerCase());
        const container = this.container;

        if (container) {
            container.innerHTML = filtered.length > 0
                ? filtered.map(post => this.renderPostCard(post)).join('')
                : '<p class="no-posts">Keine Beiträge in dieser Kategorie gefunden.</p>';
        }
    }

    renderPostCard(post) {
        return `
            <article class="blog-card" data-category="${post.category}">
                <div class="blog-card-header">
                    <span class="blog-category">${post.category}</span>
                    <span class="blog-date">${this.formatDate(post.date)}</span>
                </div>
                <h3 class="blog-title">
                    <a href="#blog/${post.slug}">${post.title}</a>
                </h3>
                <p class="blog-excerpt">${post.excerpt}</p>
                <a href="#blog/${post.slug}" class="blog-read-more">
                    Weiterlesen <span>→</span>
                </a>
            </article>
        `;
    }
}

// Initialize blog system
document.addEventListener('DOMContentLoaded', () => {
    window.blogSystem = new BlogSystem();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BlogSystem;
}
