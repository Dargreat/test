// Select elements from admin.html
const uploadForm = document.getElementById('uploadForm');
const blogList = document.getElementById('blogList');

// const backendUrl = 'https://dargreat.vercel.app';
const backendUrl = 'https://backend-for-dragreat.onrender.com';
// const backendUrl = 'http://localhost:3000';
let token = '';

// Fetch and display blog posts on page load
uploadForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const title = document.getElementById('blogTitle').value;
    const content = document.getElementById('blogContent').value;

    if (!title || !content) {
        alert("Please provide both title and content for the blog post.");
        return;
    }

    try {
        const formData = {
            title,
            content
        };

        // Send the form data to the backend
        const response = await fetch(`${backendUrl}/api/blog/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`, // Authorization header
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData), // Convert formData to JSON
        });

        const result = await response.json();
        if (response.ok) {
            alert("Blog post uploaded successfully!");
            fetchAndDisplayBlogs();
        } else {
            alert(`Error uploading blog post: ${result.message}`);
        }
    } catch (error) {
        console.error("Upload failed:", error);
        alert("Failed to upload blog post. Please try again.");
    }
});

// Delete a blog post
async function deleteBlog(blogId) {
    if (!confirm("Are you sure you want to delete? It can't be recovered unless re-uploaded.")) {
        return;
    }

    try {
        const response = await fetch(`${backendUrl}/api/blog/delete/${blogId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        });

        const result = await response.json();
        if (response.ok) {
            alert("Blog post deleted successfully!");
            fetchAndDisplayBlogs();
        } else {
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        console.error("Delete failed:", error);
        alert("Failed to delete blog post. Please try again.");
    }
}

// Fetch blog posts from backend and display them
async function fetchAndDisplayBlogs() {
    blogList.innerHTML = ''; // Clear existing list

    try {
        const response = await fetch(`${backendUrl}/api/blog`);
        if (!response.ok) {
            throw new Error('Failed to fetch blog posts');
        }
        const blogs = await response.json();
        console.log(blogs);

        blogs.forEach(blog => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span><strong>${blog.title}</strong></span>
                <p>${blog.content}</p>
                <button onclick="deleteBlog('${blog._id}')">Delete</button>
            `;

            blogList.appendChild(listItem);
        });
    } catch (error) {
        console.error("Failed to fetch blog posts:", error);
        alert("Unable to load blog posts. Please refresh the page.");
    }
}

window.onload = function() {
    fetchAndDisplayBlogs();
    (() => {
        let localToken = localStorage.getItem('authToken');
        if (!localToken || localToken == null || localToken == undefined) {
            alert('Invalid or expired auth token');
            window.location.href = '/login.html';
            return;
        }
        token = localToken;
    })();
}
