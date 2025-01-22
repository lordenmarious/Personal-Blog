async function loadPost() {
    try {
        // Get the post slug from the URL
        const slug = window.location.pathname.split('/').pop().replace('.html', '');
        
        // Load the markdown file
        const response = await fetch(`/posts/${slug}.md`);
        const markdown = await response.text();
        
        // Parse the frontmatter and content
        const { frontmatter, content } = parseFrontmatter(markdown);
        
        // Convert markdown to HTML
        const htmlContent = marked.parse(content);
        
        // Update the page
        document.title = `${frontmatter.title} - My Blog`;
        document.querySelector('.post-title').textContent = frontmatter.title;
        document.querySelector('.post-date').textContent = new Date(frontmatter.date).toLocaleDateString();
        document.querySelector('.post-content').innerHTML = htmlContent;
    } catch (error) {
        console.error('Error loading post:', error);
    }
}

function parseFrontmatter(markdown) {
    const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
    const match = markdown.match(frontmatterRegex);
    
    if (!match) {
        return {
            frontmatter: {},
            content: markdown
        };
    }
    
    const frontmatter = {};
    const frontmatterString = match[1];
    frontmatterString.split('\n').forEach(line => {
        const [key, value] = line.split(': ');
        if (key && value) {
            frontmatter[key.trim()] = value.replace(/^["']|["']$/g, '').trim();
        }
    });
    
    return {
        frontmatter,
        content: match[2]
    };
}

// Load post when the page loads
document.addEventListener('DOMContentLoaded', loadPost); 