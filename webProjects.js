document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.container');
    const snippets = [
        '<span class="keyword">const</span> <span class="variable">apiURL</span> = <span class="string">"https://api.example.com/data"</span>;',
        '<span class="keyword">async</span> <span class="keyword">function</span> <span class="function">loadData</span>() { <span class="keyword">try</span> { <span class="keyword">let</span> <span class="variable">response</span> = <span class="keyword">await</span> <span class="function">fetch</span>(<span class="string">apiURL</span>); <span class="keyword">if</span> (!<span class="variable">response</span>.<span class="function">ok</span>) { <span class="keyword">throw</span> <span class="keyword">new</span> <span class="function">Error</span>(<span class="string">"Network response was not ok"</span>); } <span class="variable">let</span> <span class="variable">data</span> = <span class="keyword">await</span> <span class="variable">response</span>.<span class="function">json</span>(); <span class="keyword">return</span> <span class="variable">data</span>; } <span class="keyword">catch</span> (<span class="variable">error</span>) { <span class="keyword">console</span>.<span class="function">error</span>(<span class="string">"There has been a problem with your fetch operation:"</span>, <span class="variable">error</span>); } }',
        '<span class="keyword">class</span> <span class="function">Person</span> { <span class="keyword">constructor</span>(<span class="variable">name</span>, <span class="variable">age</span>) { this.<span class="variable">name</span> = <span class="variable">name</span>; this.<span class="variable">age</span> = <span class="variable">age</span>; } <span class="keyword">greet</span>() { <span class="keyword">return</span> <span class="string">`Hello, my name is ${this.<span class="variable">name</span>} and I am ${this.<span class="variable">age</span>} years old.`</span>; } }',
        '<span class="keyword">const</span> <span class="variable">codeElement</span> = <span class="function">document</span>.<span class="function">createElement</span>(<span class="string">"code"</span>); <span class="variable">codeElement</span>.<span class="function">textContent</span> = <span class="string">"let x = 10; // Initialize variable"</span>; <span class="function">document</span>.<span class="function">body</span>.<span class="function">appendChild</span>(<span class="variable">codeElement</span>);',
        '<span class="keyword">const</span> <span class="variable">rectangle</span> = { <span class="attribute">width</span>: <span class="number">50</span>, <span class="attribute">height</span>: <span class="number">100</span>, <span class="attribute">calculateArea</span>: <span class="function">function</span>() { <span class="keyword">return</span> this.<span class="attribute">width</span> * this.<span class="attribute">height</span>; } }; <span class="keyword">console</span>.<span class="function">log</span>(<span class="variable">rectangle</span>.<span class="attribute">calculateArea</span>());',
        '<span class="keyword">function</span> <span class="function">animateElement</span>(<span class="variable">element</span>, <span class="variable">duration</span>) { <span class="keyword">element</span>.<span class="function">style</span>.<span class="attribute">transition</span> = <span class="string">`transform ${<span class="variable">duration</span>}s ease-in-out`</span>; <span class="keyword">element</span>.<span class="function">style</span>.<span class="attribute">transform</span> = <span class="string">"translateX(100px)"</span>; }',
        '<span class="keyword">let</span> <span class="variable">count</span> = <span class="number">0</span>; <span class="keyword">function</span> <span class="function">increment</span>() { <span class="variable">count</span>++; <span class="keyword">return</span> <span class="variable">count</span>; } <span class="keyword">console</span>.<span class="function">log</span>(<span class="function">increment</span>());',
        '<span class="tag">&lt;<span class="keyword">div</span> <span class="attribute">class</span>=<span class="string">"container"</span>&gt;</span>\n  <span class="tag">&lt;<span class="keyword">h1</span>&gt;</span>Welcome to <span class="string">My Website</span><span class="tag">&lt;/<span class="keyword">h1</span>&gt;</span>\n  <span class="tag">&lt;<span class="keyword">p</span>&gt;</span>This is a <span class="comment">comment</span> in HTML<span class="tag">&lt;/<span class="keyword">p</span>&gt;</span>\n<span class="tag">&lt;/<span class="keyword">div</span>&gt;</span>',
        '<span class="keyword">let</span> <span class="variable">html</span> = <span class="string">"<span class="tag">&lt;div</span> <span class="attribute">class</span>=<span class="string">\\"box\\"</span><span class="tag">&gt;</span>Hello <span class="variable">world</span><span class="tag">&lt;/div&gt;</span>"</span>; <span class="keyword">document</span>.<span class="function">body</span>.<span class="function">innerHTML</span> = <span class="variable">html</span>;',
        '<span class="tag">&lt;<span class="keyword">style</span>&gt;</span>\n<span class="comment">/* Keyframe animation example */</span>\n<span class="keyword">@keyframes</span> <span class="function">fadeIn</span> { <span class="keyword">from</span> { <span class="attribute">opacity</span>: <span class="number">0</span>; } <span class="keyword">to</span> { <span class="attribute">opacity</span>: <span class="number">1</span>; } }<span class="tag">&lt;/<span class="keyword">style</span>&gt;</span>',
        '<span class="keyword">const</span> <span class="variable">toggleClass</span> = (<span class="variable">element</span>, <span class="variable">className</span>) => { <span class="keyword">element</span>.<span class="function">classList.toggle</span>(<span class="string">className</span>); }; <span class="keyword">document</span>.<span class="function">querySelector</span>(<span class="string">".btn"</span>).<span class="function">addEventListener</span>(<span class="string">"click"</span>, () => <span class="function">toggleClass</span>(<span class="function">document</span>.<span class="function">body</span>, <span class="string">"dark-mode"</span>));'
    ];

    function createSnippet() {
        const snippet = document.createElement('div');
        snippet.classList.add('code-snippet');
        snippet.innerHTML = snippets[Math.floor(Math.random() * snippets.length)];
        snippet.style.left = `${Math.random() * window.innerWidth}px`;
        snippet.style.animationDuration = `${Math.random() * 3 + 2}s`;
        container.appendChild(snippet);

        // Hide the snippet after it falls and waits for 2 seconds
        snippet.addEventListener('animationend', () => {
            setTimeout(() => {

                setTimeout(() => snippet.remove(), 1000);
                snippet.style.opacity = '0';// Remove after opacity transition
            }, 5000);
        });

        // Create a new snippet every 500ms
        setTimeout(createSnippet, 1000);
    }

    createSnippet();
});
