async function loadPosts() {
    try {
        const response = await fetch('/posts/index.json');
        const posts = await response.json();
        
        const postGrid = document.querySelector('.post-grid');
        
        posts.forEach(post => {
            const postCard = createPostCard(post);
            postGrid.appendChild(postCard);
        });
    } catch (error) {
        console.error('Error loading posts:', error);
    }
}

function createPostCard(post) {
    const article = document.createElement('article');
    article.className = 'post-card';
    
    article.innerHTML = `
        <a href="/posts/${post.slug}" class="post-content">
            <span class="post-date">${new Date(post.date).toLocaleDateString()}</span>
            <h2>${post.title}</h2>
            <p class="post-excerpt">${post.excerpt}</p>
            <span class="read-more">Read More →</span>
        </a>
    `;
    
    return article;
}

// Load posts when the page loads
document.addEventListener('DOMContentLoaded', loadPosts); 