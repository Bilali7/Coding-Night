const toogle = document.querySelector('#toggle');
let currentTheme = 'light';

// Load saved theme from localStorage (if any) and apply
const savedTheme = localStorage.getItem('siteTheme');
if (savedTheme) {
    currentTheme = savedTheme;
    applyTheme(currentTheme);
    if (toogle) toogle.checked = currentTheme === 'dark';
}

// When user toggles theme, apply and persist choice
if (toogle) {
    toogle.addEventListener('change', () => {
        currentTheme = toogle.checked ? 'dark' : 'light';
        applyTheme(currentTheme);
        localStorage.setItem('siteTheme', currentTheme);
    });
}

function applyTheme(theme) {
    const body = document.querySelector('body');
    if (!body) return;
    if (theme === 'dark') {
        body.style.background = '#222';
        body.style.color = '#ffff';
    } else {
        body.style.background = '#fff';
        body.style.color = '#222';
    }
}
const h1 = document.querySelector('#ass');
const user = document.querySelector('#user');
const loginLS = JSON.parse(localStorage.getItem('loginUser'));
if(!loginLS) {
    window.location = 'login.html';
}
h1.innerHTML = `${loginLS.users}`;
let posts = [];
const storageKey = 'socialMediaPosts';

// Get DOM elements
// const authorInput = document.getElementById('authorInput');
const postInput = document.getElementById('postInput');
const postBtn = document.getElementById('postBtn');
const imageInput = document.getElementById('imageInput');
const imageBtn = document.getElementById('imageBtn');
const imageName = document.getElementById('imageName');
const searchInput = document.getElementById('searchInput');
const logoutBtn = document.getElementById('logoutBtn');
const postsContainer = document.getElementById('postsContainer');
const emptyState = document.getElementById('emptyState');
const clearAllBtn = document.getElementById('clearAllBtn');
const postCount = document.getElementById('postCount');
let selectedImage = null;

function loadPosts() {
    const savedPosts = localStorage.getItem(storageKey);
    if (savedPosts) {
        posts = JSON.parse(savedPosts);
    }
}

function savePosts() {
    localStorage.setItem(storageKey, JSON.stringify(posts));
}

function createPost() {
    const author = loginLS.users;
    const content = postInput.value.trim();

    if (!content) {
        // alert('Please write a message!');
        swal('Please write a message!');
        return;
    }

    const post = {
        id: Date.now(),
        author: author,
        content: content,
        image: selectedImage,
        timestamp: new Date().toLocaleString(),
        likes: 0,
        likedBy: [],
        comments: []
    };

    posts.unshift(post);
    savePosts();
    renderPosts();

    postInput.value = '';
    selectedImage = null;
    imageName.textContent = '';
    postInput.focus();
}

function likePost(postId) {
    const currentUser = loginLS.users;
    
    for (let i = 0; i < posts.length; i++) {
        if (posts[i].id === postId) {
            // Initialize likedBy array if it doesn't exist (for old posts)
            if (!posts[i].likedBy) {
                posts[i].likedBy = [];
            }
            
            // Check if current user already liked this post
            const likeIndex = posts[i].likedBy.indexOf(currentUser);
            
            if (likeIndex === -1) {
                // User hasn't liked yet, so add the like
                posts[i].likedBy.push(currentUser);
                posts[i].likes = posts[i].likedBy.length;
            } else {
                // User already liked, so remove the like
                posts[i].likedBy.splice(likeIndex, 1);
                posts[i].likes = posts[i].likedBy.length;
            }
            break;
        }
    }
    savePosts();
    renderPosts();
}

function addComment(postId) {
    const commentInput = document.querySelector(`#comment-input-${postId}`);
    const commentText = commentInput.value.trim();

    if (!commentText) {
        alert('Please write a comment!');
        return;
    }

    for (let i = 0; i < posts.length; i++) {
        if (posts[i].id === postId) {
            const comment = {
                id: Date.now(),
                author: 'You',
                text: commentText,
                timestamp: new Date().toLocaleTimeString()
            };
            posts[i].comments.push(comment);
            break;
        }
    }

    savePosts();
    renderPosts();
}

function deletePost(postId) {
    // Only the post author can delete the post
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    const currentUser = loginLS.users;
    if (post.author !== currentUser) {
        alert('Only the post author can delete this post.');
        return;
    }

    if (confirm('Are you sure you want to delete this post?')) {
        for (let i = 0; i < posts.length; i++) {
            if (posts[i].id === postId) {
                posts.splice(i, 1);
                break;
            }
        }
        savePosts();
        renderPosts();
    }
}

function editImage(postId) {
    // Only the post author can change the image
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    const currentUser = loginLS.users;
    if (post.author !== currentUser) {
        alert('Only the post author can edit the image.');
        return;
    }

    const tempInput = document.createElement('input');
    tempInput.type = 'file';
    tempInput.accept = 'image/*';
    tempInput.onchange = function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                for (let i = 0; i < posts.length; i++) {
                    if (posts[i].id === postId) {
                        posts[i].image = e.target.result;
                        break;
                    }
                }
                savePosts();
                renderPosts();
            };
            reader.readAsDataURL(file);
        }
    };
    tempInput.click();
}

function editPostContent(postId) {
    for (let i = 0; i < posts.length; i++) {
        if (posts[i].id === postId) {
            const currentUser = loginLS.users;
            if (posts[i].author !== currentUser) {
                alert('Only the post author can edit this post.');
                return;
            }
            const newContent = prompt('Edit your post:', posts[i].content);
            if (newContent !== null && newContent.trim()) {
                posts[i].content = newContent.trim();
                savePosts();
                renderPosts();
            }
            break;
        }
    }
}

function clearAllPosts() {
    if (confirm('Are you sure you want to delete ALL posts? This cannot be undone!')) {
        posts = [];
        savePosts();
        renderPosts();
    }
}

function toggleCommentInput(postId) {
    const commentInputWrapper = document.getElementById(`comment-input-wrapper-${postId}`);
    
    if (commentInputWrapper.style.display === 'none' || commentInputWrapper.style.display === '') {
        commentInputWrapper.style.display = 'block';
        const input = document.querySelector(`#comment-input-${postId}`);
        if (input) {
            input.focus();
        }
    } else {
        commentInputWrapper.style.display = 'none';
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function renderPosts() {
    postsContainer.innerHTML = '';

    const query = (searchInput && searchInput.value) ? searchInput.value.toLowerCase().trim() : '';
    const postsToRender = query ? posts.filter(p => {
        return (p.content && p.content.toLowerCase().includes(query)) || (p.author && p.author.toLowerCase().includes(query));
    }) : posts;

    if (postsToRender.length === 0) {
        emptyState.style.display = 'block';
        postCount.textContent = '0';
        return;
    }

    emptyState.style.display = 'none';
    postCount.textContent = postsToRender.length;

    for (let i = 0; i < postsToRender.length; i++) {
        const post = postsToRender[i];
        const postDiv = document.createElement('div');
        postDiv.className = 'post';
        postDiv.id = `post-${post.id}`;
        
        if (!post.likedBy) {
            post.likedBy = [];
        }
        
        const currentUser = loginLS.users;
        const isLikedByCurrentUser = post.likedBy.includes(currentUser);
        const isOwner = post.author === currentUser;

        let postHTML = `
            <div class="post-author">👤 ${escapeHtml(post.author)}</div>
            <div class="post-content">${escapeHtml(post.content)}</div>`;
        
        if (post.image) {
            postHTML += `<div class="post-image"><img src="${post.image}" alt="Post image" style="max-width: 100%; height: auto; border-radius: 8px; margin: 10px 0;"></div>`;
        }
        
        postHTML += `<div class="post-time">🕐 ${post.timestamp}</div>
            
            <div class="post-actions">
                <button class="btn-like ${isLikedByCurrentUser ? 'liked' : ''}" onclick="likePost(${post.id})">
                    ❤️ Like
                </button>
                <button class="btn-comment" onclick="toggleCommentInput(${post.id})">
                    💬 Comment
                </button>
                ${isOwner ? `<button class="btn-edit" onclick="editPostContent(${post.id})">
                    ✏️ Edit
                </button>` : ''}
                ${isOwner && post.image ? `<button class="btn-edit" onclick="editImage(${post.id})">
                    ✏️ Edit Image
                </button>` : ''}
                ${isOwner ? `<button class="btn-delete" onclick="deletePost(${post.id})">
                    🗑️ Delete
                </button>` : ''}
            </div>
        `;

        if (post.likes > 0) {
            postHTML += `<div class="likes-count">👍 ${post.likes} ${post.likes === 1 ? 'like' : 'likes'}</div>`;
        }

        postHTML += `<div class="comments-section" id="comments-${post.id}">`;
        
        if (post.comments.length > 0) {
            postHTML += `<div class="comments-list">`;
            for (let j = 0; j < post.comments.length; j++) {
                const comment = post.comments[j];
                postHTML += `
                    <div class="comment">
                        <span class="comment-author">${escapeHtml(comment.author)}:</span>
                        <div class="comment-text">${escapeHtml(comment.text)}</div>
                    </div>
                `;
            }
            postHTML += `</div>`;
        }

        postHTML += `
            <div id="comment-input-wrapper-${post.id}" class="comment-input-wrapper" style="display: none;">
                <input type="text" id="comment-input-${post.id}" placeholder="Add a comment..." maxlength="200">
                <button class="btn-comment" onclick="addComment(${post.id})">Post</button>
            </div>
        `;

        postHTML += `</div>`;
        postDiv.innerHTML = postHTML;
        postsContainer.appendChild(postDiv);
    }
}

postBtn.onclick = createPost;
clearAllBtn.onclick = clearAllPosts;
imageBtn.onclick = () => imageInput.click();

if (searchInput) {
    searchInput.oninput = renderPosts;
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        // Optional: confirm logout
        const ok = confirm('Are you sure you want to logout?');
        if (!ok) return;
        localStorage.removeItem('loginUser');
        window.location = 'login.html';
    });
}

imageInput.onchange = function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            selectedImage = e.target.result;
            imageName.textContent = `✓ ${file.name}`;
        };
        reader.readAsDataURL(file);
    }
};

postInput.onkeypress = function(event) {
    if (event.key === 'Enter' && event.ctrlKey) {
        createPost();
    }
};

loadPosts();
renderPosts();
console.log('🚀 Social Media App initialized!');